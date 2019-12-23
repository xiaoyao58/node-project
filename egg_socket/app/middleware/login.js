const _ = require('lodash');
module.exports = options => {
    return async function login(ctx, next) {
        var user_id = ctx.request.body.user_id;
        var user = await ctx.service.user.get(user_id);
        console.log("Middleware:"+user[0]);
        if(_.isEmpty(user)){
            ctx.body = '没有该用户信息';
        }else{
            ctx.user = user[0];
            await next();
        }
    }
}