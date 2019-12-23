'use strict';
const {
    promisify
} = require('util');
const _ = require('lodash');
const Service = require('egg').Service;

class MsgService extends Service {
    async save(msg) {
        var {
            ctx,
            app
        } = this;
        var pool = ctx.service.sqlPool;
        var sql = 'insert into conv_msg set ?';
        var params = [msg];
        try {
            pool.exec_sql(sql, params);
        } catch (error) {
            if (error) app.logger.error(error);
        }
    }

    async get(conv_id, page_size, page_index) {
        var {
            ctx,
            app
        } = this;
        var pool = ctx.service.sqlPool;
        var page_size = parseInt(page_size);
        var page_index = parseInt(page_index);
        var limit = page_size;
        var offset = page_size * (page_index - 1);
        var sql = 'select msg_id,msg,msg_type,from_user,create_at from conv_msg where conv_id = ? order by create_at desc limit ? offset ?';
        var params = [conv_id, limit, offset];
        try {
            var result = await pool.exec_sql(sql, params);
            return result;
        } catch (error) {
            if (error) app.logger.error(error);
        }
    }
}


module.exports = MsgService;