'use strict';
const Controller = require('egg').Controller;
const moment = require('moment');
class ConvMemberController extends Controller {
  async add_conv_member() {
    const ctx = this.ctx;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const req = ctx.request.body;
    const conv_id = req.conv_id;
    const user_id = req.user_id;
    const is_remind = req.is_remind ? req.is_remind : 0;
    const is_top = req.is_top ? req.is_top : 0;
    const create_user = ctx.user.user_id;
    const create_at = now;

    const member = {
      conv_id,
      user_id,
      is_remind,
      is_top,
      create_user,
      create_at,
    };

    ctx.service.conv.conv_member.add_conv_member(member);
  }
}
module.exports = ConvMemberController;
