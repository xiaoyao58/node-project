'use strict';

const Service = require('egg').Service;

class UsersService extends Service {
    async to_avatar(avatar) {
        var app = this.app;
        if (avatar && avatar.indexOf(wdzt.base) >= 0)
            return avatar;
        return app.config.wdztcs.base + '/avatar/u/m/' + (avatar ? avatar : 'default.gif');
    }

    async to_simple(x) {
		if (!x) {
			return {};
        }
        var ctx = this.ctx;
		var rlt_user = {
			user_id: x.user_id,
			name: x.name,
			avatar: ctx.service.users.to_avatar(x.avatar),
			status: x.status
		}
		if(x.dept_name){
			rlt_user.dept_name = x.dept_name;
		}
		if(x.job) {
			rlt_user.job = x.job;
		}
		return rlt_user;
	}
}

module.exports = UsersService;
