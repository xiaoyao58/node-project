module.exports = app =>{
    return async (ctx,next) =>{
        ctx.socket.emit('result','connected!');
        await next();
        console.log('disconnected!');
    };
};