'use strict';

const Service = require('egg').Service;

class Conv_msgService extends Service {

  async save(msg){
    var {ctx,app} = this;
    var pool = ctx.service.sqlPool;
    var sql = 'insert into conv_msg set ?';
    var params = [msg];
    try {
      pool.exec_sql(sql,params);
    } catch (error) {
      if(error) app.logger.error(error);
    }
  }

  async get(conv_id,page_size,page_index){
    var {ctx,app} = this;
    var pool = ctx.service.sqlPool;
    var page_size = parseInt(page_size);
    var page_index = parseInt(page_index);
    var limit = page_size;
    var offset = page_size*(page_index-1);
    var sql = 'select msg_id,msg,msg_type,from_user,create_at from conv_msg where conv_id = ? order by create_at desc limit ? offset ?';
    var params = [conv_id,limit,offset];
    try {
      var result = await pool.exec_sql(sql,params);
      return result;
    } catch (error) {
      if(error) app.logger.error(error);
    }
  }


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
