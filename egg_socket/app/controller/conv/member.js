'use strict';
const Controller = require('egg').Controller;
const moment = require('moment');
class MemberController extends Controller{
    async save(){
        var req = this.ctx.request.body;
        var conv_id = req.conv_id;
        var user_id = req.user_id;
        var is_remind = req.is_remind;
        var is_top = req.is_top;
        var last_read_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var create_user = req.create_user;
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var members = {
            conv_id:conv_id,
            user_id: user_id,
            is_remind: is_remind,
            is_top: is_top,
            last_read_at: last_read_at,
            create_at:create_at,
            create_user:create_user
        }
        this.ctx.service.member.save(members);
        this.ctx.response.body = conv_id;
    }
}

module.exports = MemberController;