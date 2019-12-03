'use strict';

const Controller = require('egg').Controller;

class HelloController extends Controller {
   async sayHello(){
     const {ctx} = this;
     var say = await ctx.service.hello.sayHello();
     ctx.body = say;
   }
}

module.exports = HelloController;
