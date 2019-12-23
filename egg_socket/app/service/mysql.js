'use strict';
const {promisify} = require('util');
const Service = require('egg').Service;
class MysqlService extends Service {
    async exec_sql(sql_text,params,cb) {
        var mysql = require('mysql');
        var pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database: 'egg',
            multipleStatements: true
        });
        return pool.query(sql_text,params,cb);
    }
}
module.exports = MysqlService;

