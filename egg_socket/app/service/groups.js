'use strict';

const Service = require('egg').Service;

class GroupsService extends Service {
    async to_avatar(avatar) {
        var app = this.app;
        return app.config.wdztcs.base + '/avatar/g/m/' + (avatar ? avatar : 'default.gif');
    }
    async to_simple(x) {
        if (!x) {
            return {};
        }
        return {
            group_id: x.group_id,
            group_name: x.group_name,
            avatar: this.groups.to_avatar(x.avatar)
        };
    }
}

module.exports = GroupsService;
