'use strict';

const Service = require('egg').Service;

class Conv_msgService extends Service {
  async to_simple(x) {
    if (!x) {
        return {};
    }
    var rlt = {
        auto_id: x.auto_id,
        msg_id: x.msg_id,
        conv_id: x.conv_id,
        msg: x.msg,
        msg_type: x.msg_type,
        from_user: x.from_user,
        create_at: x.create_at ? moment(x.create_at).format('YYYY-MM-DD HH:mm:ss') : '',
        create_at_s: x.create_at ? moment(x.create_at).fromNow() : ''
    };
    if(x.msg_type==6) {//链接消息
        rlt.link_thumbnail = this.app.config.wdztcs.base + '/api/common/proxy?src=' + x.link_thumbnail;
        rlt.link_url = x.link_url;
        rlt.link_title = x.link_title;
    }
    return rlt;
  }
}

module.exports = Conv_msgService;
