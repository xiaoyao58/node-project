'use strict';

const Service = require('egg').Service;

class ConvService extends Service {
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
