'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async get(user_id){
        const {ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = 'select * from user where user_id = ?';
        var params = [user_id];
        try{
            var result = await pool.exec_sql(sql,params);
            return result;
        }catch(error){
            if(error) app.logger.error(error);
        }
    }
    
    async save(user){
        const{ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = 'insert into user set ?';
        var params = [user];
        try{
            await pool.exec_sql(sql,params);
        }catch(error){
            if(error) app.logger.error(error);
        }
    }
}

module.exports = UserService;