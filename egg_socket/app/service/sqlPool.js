'use strict';

const Service = require('egg').Service;
 const {promisify} = require('util');
class SqlPoolService extends Service {
   async exec_sql(sql,params) {
   
        var exec = promisify(this.ctx.service.mysql.exec_sql);
        var result = await exec(sql,params);
        return result;
  }
}

module.exports = SqlPoolService;
