'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class TestController extends Controller {
  async chat() {
    var ctx = this.ctx;
    var req = ctx.request.body;
    var res = ctx.response.body;
    var conv_id = req.conv_id;
    if(!conv_id){
        return ctx.logger.error('对话编号不能为空');
    }
    var result = await ctx.service.chat.start(conv_id);
    res = result;
  }

  async redis(){
    var redis = this.app.redis;
    redis.lpush('msg','message1');
  }

  async get_msg(){
    this.app.redis.llen('msg',async (err,len)=>{
      if(err) return this.ctx.logger.error(err);
      if(len==0){
        var data = await this.ctx.service.msg.get(10,0);
        data.list = _.orderBy(data.list,'create_at','asc');
        _.forEach(data.list,(d)=>{
          var msg = JSON.stringify(d);
          this.app.redis.lpush('msg',msg);
        });

      }
    });
    var result = await this.ctx.service.msg.get(10,10);

    this.ctx.response.body = result;
  }
}

module.exports = TestController;
