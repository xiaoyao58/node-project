'use strict';
const Controller = require('egg').Controller;

//定义ctx.request.body的请求规则
const createRule = {
    accessToken: 'string',
    title: 'string',
    tab: {type:'enum',values:['ask','share','job'],required:false},
    content: 'string',
}

class TopicsController extends Controller{
    async create(){
        const ctx = this.ctx;
        //
        ctx.validate(createRule,ctx.request.body);
    }
}
module.exports = TopicsController;