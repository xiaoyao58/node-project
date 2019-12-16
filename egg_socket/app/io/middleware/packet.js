module.exports = app => {
    return async (ctx, next)=>{
        ctx.socket.emit('packet', 'packet received!');
        ctx.id = ctx.socket_id;
        console.log(ctx.socket.id);
        await next();
    };
};