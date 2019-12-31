'use strict';
const _ = require('lodash');
module.exports = options => {
  return async function login(ctx, next) {
    const user_id = ctx.request.body.user_id;
    const user = await ctx.service.user.user.get_user_by_login(user_id);
    if (_.isEmpty(user)) {
      ctx.body = '没有该用户信息';
    } else {
      ctx.user = user[0];
      await next();
    }
  };
};
