'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const { promisify } = require('util');
const _ = require('lodash');
class ChatController extends Controller {
    async res() {
        var ctx = this.ctx;
        var app = this.app;
        const { socket, logger, helper } = this.ctx;
        const message = ctx.args[0] || {};
        var user_id = message.user_id
        var msg = message.msg;
        var msg = { socket_id: ctx.socket.id, user_id: user_id, msg: msg };
        var { target, payload } = message;
        console.log(msg);
        var room = 'room1';
        var id = ctx.id;

        // 根据id给指定连接发送消息
        const nsp = app.io.of('/');
        nsp.sockets[id].emit('res', "hello " + id);

        const chat_nsp = app.io.of('/chat');
        chat_nsp.emit('chat', 'hello chat');
        chat_nsp.emit('res', 'chat res');

        const news_nsp = app.io.of('/news');
        news_nsp.emit('news', 'hello news');

        socket.emit('now', moment().format('YYYY-MM-DD HH:mm:ss'))
        setInterval(() => {
            ctx.socket.emit('now', moment().format('YYYY-MM-DD HH:mm:ss'))
        }, 1800000);

        // socket.emit('res',msg);


        ctx.socket.join('room1');

        // 指定房间连接信息列表
        // nsp.adapter.clients([room], (err, clients) => {
        //     if(err) logger(err);
        //     console.log(JSON.stringify(clients));
        // });



        //  给指定房间的每个人发送消息
        nsp.to('room1').emit('online', this.ctx.socket.id + "上线了");


        app.redis.lpush('msg', JSON.stringify(msg));
        app.redis.lrange('msg', 1, 10, (err, data) => {
            if (err) ctx.logger.error(err);
            nsp.to('room1').emit('msg', data);
        })




        // 断开连接
        //this.ctx.socket.disconnect();
    }
    async chat() {
        var { ctx, app } = this;
        var socket = ctx.socket;
        var chat = app.io.of('/chat');
        chat.emit('chat', 'hello chat,socketId:' + socket.id);
        socket.emit('chat', 'hello new chat');

    }

    async news() {
        var room = 'room2';
        var query = this.ctx.socket.handshake.query;
        var conv_id = query.conv_id;
        this.ctx.socket.join(room);
        var message = this.ctx.args[0];
        var {target,payload} = message;
        var message = message ? message : '';
        if (!_.isEmpty(message)) {
            message.create_at = moment().format('YYYY-MM-DD HH:mm:ss');
            this.ctx.service.msg.save(message.user_id,message.msg,message.create_at);
            message = JSON.stringify(message);
          await this.app.redis.lpush(conv_id, message);
        };
       this.app.redis.lrange(conv_id, 0, 9, (err, data) => {
            if (err) this.ctx.logger.error(err);
            if (!_.isEmpty(data)) {
                this.app.io.of('/news').to(room).emit(conv_id,data);
            }
        });

        this.app.redis.ltrim(conv_id,0,9);//保留指定区间的值，此外的值将被移除

        //  指定房间连接信息列表
        this.app.io.of('/news').adapter.clients([room], (err, clients) => {
            if(err) logger(err);
            console.log(JSON.stringify(clients));
        });
    }
}
module.exports = ChatController;
