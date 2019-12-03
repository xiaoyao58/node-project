module.exports = option =>{
    return async function newMiddle(ctx,next){   
        const newM = 'the new middleware';
        console.log(newM);
        await next();
    }
}