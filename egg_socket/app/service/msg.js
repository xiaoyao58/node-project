'use strict';
const {promisify} = require('util');
const _ = require('lodash');
const Service = require('egg').Service;

class MsgService extends Service {
  async save(id,message,create_at) {
      var exec_sql = promisify(this.ctx.service.mysql.exec_sql);
      try {
          var sql = 'insert into msg set ?';
          var params = [{
              msg:message,
              uid: id,
              create_at: create_at
          }]
        exec_sql(sql,params);
      } catch (error) {
          this.ctx.logger.error(error);
      }
  }
  async get(limit,offset){
    var exec_sql = promisify(this.ctx.service.mysql.exec_sql);
    var result = {};
    result.list = [];
    try {
        var sql = 'select msg,uid,create_at from msg order by create_at desc limit ? offset ?';
        var data = await exec_sql(sql,[limit,offset]);
        _.forEach(data,(d)=>{
            var msg = {};
            msg.user_id = d.uid;
            msg.msg = d.msg;
            msg.create_at = d.create_at;
            result.list.push(msg);
        });
        return result;
    } catch (error) {
        this.ctx.logger.error(error);
    }
  }
}

module.exports = MsgService;
