module.exports = app => {
    return async (ctx, next) => {
        var query = ctx.socket.handshake.query;
        ctx.socket.emit('packet', 'packet received!');
        ctx.id = ctx.socket_id;
        console.log(ctx.socket.id);
        var user_id = query.user_id;
        var user = await ctx.service.user.get(user_id);
        ctx.user = user[0];
        ctx.avatar = "10.2.100.122:7001/public/avatar/"+ctx.user.avatar;
        await next();
    };
};