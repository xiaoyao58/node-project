'use strict'
const Service = require('egg').Service;
const _ = require('lodash');
class MemberService extends Service {
    
    //获取所有对话成员信息
    async getByConv(conv_id) {
        var {ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = 'select * from conv_member where conv_id = ?';
        var params = [conv_id];
        try {
            var result = await pool.exec_sql(sql, params);
            return result;
        } catch (error) {
            if (error) app.logger.error(error);
        }
    }
    //获取单个对话成员信息
    async getByConvAndUser(conv_id, user_id) {
        var {ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = 'select * from conv_member where conv_id = ? and user_id = ?';
        var params = [conv_id, user_id];
        try {
            var result = await pool.exec_sql(sql, params);
            return result;
        } catch (error) {
            if (error) app.logger.error(error);
        }
    }
    //获取当前用户的对话列表
    async getConvByUser(user_id){
        var {ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = 'select distinct conv_id from cov_member where user_id = ?';
        var params = [user_id];
        try{
            var result = await pool.exec_sql(sql,params);
            return result;
        }catch(error){
            if(error) app.logger.error(error);
        }
        
    }

    async save(conv_members) {
        var {ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = 'insert into conv_member set ?';
        var params = [conv_members];
        try {
            pool.exec_sql(sql, params);
        } catch (error) {
            if (error) app.logger.error(error);
        }
    }

    //删除对话中一个或多个成员信息，多个成员信息用","分开
    async delete(conv_id, users) {
        var {ctx,app} = this;
        var pool = ctx.service.sqlPool;
        var sql = "";
        var params = [];
        if(!_.isEmpty(users)){
            sql = 'delete from conv_member where conv_id =? and user_id = ?';
            params = [conv_id, users];
        }else {
            sql = 'delete from conv_member where conv_id=?';
            params = [conv_id];
        }
        try {
            pool.exec_sql(sql,params);
        } catch (error) {
            if(error) app.logger.error(error);
        }
        
    }
}

module.exports = MemberService;