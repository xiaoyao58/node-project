'use strict';
const {promisify} = require('util');
const moment = require('moment');
const _ = require('lodash');
const Service = require('egg').Service;

class ConvService extends Service {
	async get(conv_id){
		var {ctx,app} = this;
		var pool = ctx.service.sqlPool;
		var sql = "";
		var params = [];
		if(!_.isEmpty(conv_id)){
			sql = 'select * from conv where conv_id = ?';
			params = [conv_id];
		}else{
			sql = 'select * from conv';
			params = [];
		}
		
		try {
			var result = await pool.exec_sql(sql,params);
			return result;
		} catch (error) {
			if(error) app.logger.error(error);
		}
	}
	
	async save(conv){
		var {ctx,app} = this;
		var pool = ctx.service.sqlPool;
		var sql = 'insert into conv set ?';
		var params = [conv];
		try {
			pool.exec_sql(sql,params);
		} catch (error) {
			if(error) app.logger.error(error);
		}
	}
	async edit(conv,conv_id){
		var {ctx,app} = this;
		var pool = ctx.service.sqlPool;
		var sql = 'update conv set ? where conv_id = ?';
		var params = [conv,conv_id];
		try {
			pool.exec_sql(sql,params);
		} catch (error) {
			if(error) app.logger.error(error);
		}
	}

	async delete(conv_id){
		var {ctx,app} = this;
		var pool = ctx.service.sqlPool;
		var sql = 'delete from conv where conv_id = ?';
		var params = [conv_id];
		try {
			pool.exec_sql(sql,params);
		} catch (error) {
			if(error) app.logger.error(error);
		}
	}

    async to_simple(x) {
        if (!x) {
			return {};
        }
        var ctx = this.ctx;
        var conv = ctx.service.conv;
		var simple = {
			conv_id: x.conv_id,
			conv_name: x.conv_name,
			conv_desc: x.conv_desc,
			conv_type: x.conv_type,
			active_at: x.active_at ? moment(x.active_at).format('YYYY-MM-DD HH:mm:ss') : '',
			active_at_s: x.active_at ? moment(x.active_at).fromNow() : '',
			create_user: x.create_user,
			avatar: conv.to_avatar(x.avatar),
			is_readonly: 0
		};
		if (simple.conv_type == 5 || simple.conv_type == 6) {
			simple.sysconv_id = x.sysconv_id;
			simple.conv_status = x.conv_status;
			simple.sysconv_user = x.sysconv_user;
		}
		return simple;
    }

    async to_avatar(avatar) {
        var { ctx, app } = this;
        var base = app.config.wdztcs.base;
        if (avatar == 't') return base + '/avatar/c/default_task.png';
        else if (avatar == 'c') return base + '/avatar/c/default_cal.png';
        else if (avatar == 's') return base + '/avatar/c/default_sys.png';
        else if (avatar == 'r') return base + '/avatar/c/default_res.png';
        else return base + '/avatar/c/' + (avatar ? avatar : 'default.gif');
    }
}

module.exports = ConvService;
