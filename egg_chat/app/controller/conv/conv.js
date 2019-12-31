'use strict';
const { Controller } = require('egg');
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');
class ConvController extends Controller {
  // 创建私聊对话
  async create_private_conv() {

    const createRule = {
      conv_id:'string',
      conv_desc:'string',
      conv_type:{type:'enum',values:[1,2,3,4,5,6,7],required:false},
      create_user:'string',
      sysconv_id:'string',
      conv_status:{type:'enum',values:[0,1,2,3],require:false},
      avatar:'string',
      user_id:'string',
      is_remind:{type:'enum',values:[0,1],required:false},
      is_top:{type:'enym',values:[0,1],required:false},
    }

    const { ctx } = this;
    const req = ctx.request.body;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    const conv_id = uuid.v4();
    const conv_name = req.conv_name;
    const conv_desc = req.conv_desc ? req.conv_desc : null;
    const conv_type = 1;
    const create_user = ctx.user.user_id;
    const create_at = now;
    const project_id = ctx.user.project_id;
    const active_at = now;
    const sysconv_id = req.sysconv_id ? req.sysconv_id : null;
    const conv_status = req.conv_status ? req.conv_status : 1;
    const avatar = req.conv_avatar ? req.conv_avatar : '';

    const user_id = req.user_id;
    const is_remind = req.is_remind;
    const is_top = req.is_top;

    ctx.validate(createRule,ctx.request.body);

    if (_.isEmpty(conv_name) || _.isEmpty(create_user)) {
      return ctx.logger.error('controller.conv.create_private_conv: \"conv_name or conv_type or create_user is null!\"');
    }
    const conv_msg = {
      conv_id,
      conv_name,
      conv_desc,
      conv_type,
      create_user,
      create_at,
      project_id,
      active_at,
      sysconv_id,
      conv_status,
      avatar,
    };

    const conv_member_msg = {
      conv_id,
      user_id,
      is_remind,
      is_top,
      last_read_at: now,
      create_user,
      create_at: now,
    };
    try {
      const result = await ctx.service.conv.conv.create_private_conv(user_id, conv_msg, conv_member_msg);
      ctx.body = result;
      ctx.status = 201;
    } catch (error) {
      ctx.logger.error('controller.conv.conv.create_private_conv: ' + error);
    }
  }

  // 获取私聊对话
  async get_private_conv() {
    const ctx = this.ctx;
    const req = ctx.request.body;
    const filter = req.conv_private_filter;
    try {
      const result = await ctx.service.conv.conv.get_private_conv(filter);
      ctx.body = result;
    } catch (error) {
      ctx.logger.error('controller.conv.conv.ger_private_conv: ' + error);
    }
  }

  async create_conv() {
    const ctx = this.ctx;
    const req = ctx.request.body;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    const conv_id = uuid.v4();
    const conv_name = req.conv_name;
    const conv_desc = req.conv_desc ? req.conv_desc : null;
    const conv_type = 1;
    const create_user = ctx.user.user_id;
    const create_at = now;
    const project_id = ctx.user.project_id;
    const active_at = now;
    const sysconv_id = req.sysconv_id ? req.sysconv_id : null;
    const conv_status = req.conv_status ? req.conv_status : 1;
    const avatar = req.conv_avatar ? req.conv_avatar : '';

    const user_ids = req.user_ids.split(',');
    const is_remind = req.is_remind;
    const is_top = req.is_top;

    if (_.isEmpty(conv_name) || _.isEmpty(create_user)) {
      return ctx.logger.error('controller.conv.create_private_conv: \"conv_name or conv_type or create_user is null!\"');
    }
    const conv_msg = {
      conv_id,
      conv_name,
      conv_desc,
      conv_type,
      create_user,
      create_at,
      project_id,
      active_at,
      sysconv_id,
      conv_status,
      avatar,
    };

    const conv_member_msg = [];
    _.forEach(user_ids, id => {
      const conv_member = [ conv_id, id, is_remind, is_top, now, create_user, now ];
      conv_member_msg.push(conv_member);
    });
    try {
      const result = await ctx.service.conv.conv.create_conv(conv_msg, conv_member_msg);
      ctx.body = result;
      ctx.status = 201;
    } catch (error) {
      ctx.logger.error('controller.conv.conv.create_private_conv: ' + error);
    }

  }
}
module.exports = ConvController;
