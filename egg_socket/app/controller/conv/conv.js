'use strict';
const Controller = require('egg').Controller;
const moment = require('moment');
const _ = require('lodash');
const uuid = require('node-uuid');
class ConvController extends Controller {
	async get(){
		var conv_id = this.ctx.request.conv_id;
		var data = await this.ctx.service.conv.conv.get(conv_id);
		var result = {};
		result.list = [];
		if(!_.isEmpty(data)){
			_.forEach(data,(d)=>{
				var conv = {};
				conv.conv_id = d.conv_id;
				conv.conv_name = d.conv_name;
				conv.conv_desc = d.conv_desc;
				conv.conv_type = d.conv_type;
				conv.create_user = d.create_user;
				conv.create_at = moment(d.create_at).format('YYYY-MM-DD HH:mm:ss');
				conv.active_at = moment(d.active_at).format('YYYY-MM-DD HH:mm:ss');
				conv.conv_status = d.conv_status;
				conv.avatar = d.avatar;
				result.list.push(conv);
			});
		}
		this.ctx.body = result;
	}

	async save() {
		var ctx = this.ctx;
		var req = ctx.request.body;
		var conv_id = uuid.v4();
		var conv_name = req.conv_name;
		var conv_desc = req.conv_desc;
		var conv_type = parseInt(req.conv_type);
		var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
		var create_user = ctx.user.user_id;
		var active_at = moment().format('YYYY-MM-DD HH:mm:ss');
		var conv_status = req.conv_status ? req.conv_status : 1;
		var avatar = req.avatar?req.avatar:null;

		var conv = {
			conv_id: conv_id,
			conv_name: conv_name,
			conv_desc: conv_desc,
			conv_type: conv_type,
			create_user: create_user,
			create_at: create_at,
			active_at: active_at,
			conv_status: conv_status,
			avatar: avatar
		};

		var conv_member = {
			conv_id: conv_id,
			user_id: ctx.user.user_id,
			is_remind: 0,
			is_top: 0,
			last_read_at: moment().format('YYYY-MM-DD HH:mm:ss'),
			create_user: create_user,
			create_at: create_at
		}
		try {
			await ctx.service.conv.conv.save(conv);
			await ctx.service.conv.member.save(conv_member);
			ctx.body = conv_id;
		} catch (error) {
			if (error) ctx.logger.error(error);
		}
	}
	
	async edit(){
		var req = this.ctx.request;
		var conv_id = req.conv_id;
		var conv = {}
		var conv_name = req.conv_name?req.conv_name:null;
		var conv_desc = req.conv_desc?req.conv_desc:null;
		var conv_type = req.conv_type?req.conv_type:null;
		var active_at = moment().format('YYYY-MM-DD HH:mm:ss');
		var conv_status = req.conv_status ? req.conv_status : null;
		if(conv_name){
			conv.conv_name = conv_name;
		}
		if(conv_desc){
			conv.conv_desc = conv_desc;
		}
		if(conv_type){
			conv.conv_type = conv_type;
		}
		conv.active_at = active_at;
		if(conv_status){
			conv.conv_status = conv_status;
		}
		this.ctx.service.conv.conv.edit(conv,conv_id);
	}

	async delete(){
		var ctx = this.ctx;
		var conv_id = ctx.request.body.conv_id;
		ctx.service.conv.conv.delete(conv_id);
		ctx.service.conv.member.delete(conv_id);
	}
}
module.exports = ConvController;