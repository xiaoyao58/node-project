const room = "default_room";
module.exports = app => {
    return async (ctx, next) => {
        const {app,socket,logger,helper} = ctx;
        // 权限校验通过
        ctx.socket.emit('server', 'server connect success');
        var req = ctx.request;
        var room = req.conv_id;
        // 加入房间
        socket.join(room);
        const socket_id = socket.id;
        console.log(socket_id+"已连接");
        await next();
        console.log(socket_id+'断开连接');

    }
};
