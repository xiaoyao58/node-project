'use strict';
const _ = require('lodash');
module.exports = app => {
  return async (ctx, next) => {
    const query = ctx.socket.handshake.query;
    ctx.socket.emit('packet', 'packet received!');
    // ctx.id = ctx.socket_id;
    const user_id = query.user_id;
    const conv_id = query.conv_id;
    const user_arg = { user_id };
    try {
      const conv = await ctx.exec_sql('select * from conv_member where conv_id = ? and user_id = ?', [ conv_id, user_id ]);
      if (_.isEmpty(conv)) {
        return ctx.socket.emit('err', '该对话列表不存在或您并未加入当前对话列表');
      }

      ctx.socket.emit('err', null);
      const user = await ctx.service.user.user.get_user(user_arg);
      const file = await ctx.service.file.files.get_files({ obj_id: user_id });
      const result = {
        user_id: user[0].user_id,
        name: user[0].name,
        avatar: '10.2.100.113:7001/' + file[0].file_path + '/' + user[0].avatar,
      };
      ctx.socket_user = result;
      await next();


    } catch (error) {
      ctx.logger.error('controller.user.user.get_user: ' + error);
    }
  };
};
