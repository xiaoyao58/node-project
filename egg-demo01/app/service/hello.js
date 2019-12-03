const Service = require('egg').Service;
class HelloService extends Service{
    async sayHello(){
        const say = "hello world";
        return say;
    }
}
module.exports = HelloService;