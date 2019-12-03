'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
  async ping() {
    const {ctx,app} = this;
    const message = ctx.args[0];
    await ctx.socket.emit('result',`message: ${message}`);

    //发送给自己
    this.socket.emit('result','我自己');

    //发送给除了自己之外的人
    this.socket.broadcast.emit('result','发送给其他人');

    //发送给所有人,包括自己
    this.server.sockets.emit('result','发送给所有人');
  }
}

module.exports = ChatController;
