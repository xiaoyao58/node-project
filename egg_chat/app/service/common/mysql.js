'use strict';
const Service = require('egg').Service;
const mysql = require('mysql');
class MysqlService extends Service {
  async exec_sql(sql_text, params, cb) {
    const pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '123456',
      database: 'egg_chat',
      multipleStatements: true,
    });
    return pool.query(sql_text, params, cb);
  }
}
module.exports = MysqlService;

