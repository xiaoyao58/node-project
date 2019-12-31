'use strict';
const Controller = require('egg').Controller;
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');
class ChatController extends Controller {
  async chat() {
    const query = this.ctx.socket.handshake.query;
    const conv_id = query.conv_id;
    const user_id = this.ctx.socket_user.user_id;
    const name = this.ctx.socket_user.name;
    const avatar = this.ctx.socket_user.avatar;
    let message = this.ctx.args[0];// 获取client信息
    message = message ? message : '';
    const room = this.ctx.room;
    if (!_.isEmpty(message)) {
      message.user_id = user_id;
      message.name = name;
      message.avatar = avatar;
      message.create_at = moment().format('YYYY-MM-DD HH:mm:ss');
      const msg = {
        msg_id: uuid.v4(),
        conv_id,
        msg: message.msg,
        msg_type: 0,
        from_user: this.ctx.socket_user.user_id,
        create_at: message.create_at,
      };
      this.ctx.service.msg.convMsg.add_msg(msg);
      message = JSON.stringify(message);
      await this.app.redis.lpush(conv_id, message);
    }
    this.app.redis.lrange(conv_id, 0, 9, (err, data) => {
      if (err) this.ctx.logger.error(err);
      if (!_.isEmpty(data)) {
        this.app.io.of('/chat').to(room).emit(conv_id, data);
      }
    });

    this.app.redis.ltrim(conv_id, 0, 9);// 保留指定区间的值，此外的值将被移除

    //  指定房间连接信息列表
    this.app.io.of('/chat').adapter.clients([ room ], (err, clients) => {
      if (err) this.ctx.logger(err);
      console.log(JSON.stringify(clients));
    });
  }
}
module.exports = ChatController;
