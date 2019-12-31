'use strict';

const Service = require('egg').Service;
const { promisify } = require('util');
class SqlPoolService extends Service {
  async exec_sql(sql, params) {

    const exec = promisify(this.ctx.service.common.mysql.exec_sql);
    const result = await exec(sql, params);
    return result;
  }
}

module.exports = SqlPoolService;
