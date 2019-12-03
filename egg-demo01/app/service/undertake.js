'use strict';
const _ = require('lodash');
const Service = require('egg').Service;


class DocService extends Service {
  async getUndertake() {
    const {ctx,app} = this;
    // var user_id = ctx.user.user_id;
    var user_id = "01be804e-44e7-41ef-9286-e674d79f9960";
    var dept = [];
    _.forEach(ctx.dept,(d)=>{
        dept.push(d.dept_id);
    });
   var datas = await app.mysql.query('select ap.app_uuid,ac.activity_uuid,de.gw_id,ap.title,ap.biz_type_id,dbt.biz_type_name,ap.is_urgent,ap.is_dc,ap.host_dept_id,ap.host_dept_name,ap.deadline,ap.finish_at,de.gw_type from doc_deal de,doc_app ap,doc_activity ac,dic_biz_type dbt where de.gw_id = ap.app_uuid and ap.app_uuid = ac.app_uuid and dbt.biz_type_id = ap.biz_type_id and ac.user_id = ?',user_id);
   return datas;
  }
  async getTopic(gw_id,limit,offset){
    const {ctx,app} = this;
    // var user_id = ctx.user.user_id;
    var user_id = '2243852F-77E9-417D-A04C-0C7B806456D8'
    var result = await app.mysql.query('select dt.topic_id,dt.message,dt.create_user,u.`name`,u.avatar,dt.create_at,dt.reply_topic_id,dt.topic_type from doc_deal_topic dt inner join wdzt.users u on dt.create_user = u.user_id left join doc_deal_topic_user dtu on dt.topic_id = dtu.topic_id where (dtu.user_id = ? or dt.create_user = ?) and dt.gw_id = ? limit ? offset ? ',[user_id,user_id,gw_id,limit,offset]);
    // var result = await app.mysql.query('select dt.topic_id,dt.message,dt.create_user,u.`name`,u.avatar,dt.create_at,dt.reply_topic_id,dt.topic_type from doc_deal_topic dt inner join wdzt.users u on dt.create_user = u.user_id left join doc_deal_topic_user dtu on dt.topic_id = dtu.topic_id where (dtu.user_id = "2243852F-77E9-417D-A04C-0C7B806456D8" or dt.create_user = "2243852F-77E9-417D-A04C-0C7B806456D8") and dt.gw_id = "584703b2e2064be3ad566479978a975d" limit 1 offset 0');
    return result;
  }

  async getMemHg(gw_id){
    const {ctx,app} = this;
    var result = await app.mysql.query('select hg.gw_dept_id,hg.gw_dept_name from doc_fw f inner join doc_fw_hg hg on f.fw_id = hg.fw_id and f.fw_id = ?',gw_id);
    return result;
  }

  async getMemFw(gw_id){
    const {ctx,app} = this;
    var result = await app.mysql.query('select gw_dept_id,gw_dept_name from doc_fw where fw_id = ?',gw_id);
    return result;
  }
  async getMemTopic(gw_id){
    const {ctx,app} = this;
    var result = await app.mysql.query('select dt.topic_id,dt.message,dt.topic_type,dt.create_user,dt.reply_topic_id,u.`name`,u.avatar from doc_deal_topic dt,wdzt.users u where dt.create_user = u.user_id and gw_id =? order by dt.create_at desc limit 20 offset 0',gw_id);
    return result;
  }
  async getMembers(gw_id){
    const {ctx,app} =this;
    var result = await app.mysql.query('select u.user_id,u.name,u.avatar,dm.is_leader,dm.gw_dept_id from doc_deal_member dm,wdzt.users u where dm.user_id = u.user_id and dm.gw_id = ?',gw_id);
    return result;
  }
  async getLogs(gw_id,limit,offset){
    const app = this.app;
    var result = await app.mysql.query('select auto_id,message,create_at from doc_deal_log where gw_id = ? limit ? offset ?',[gw_id,limit,offset]);
    return result;
  }
  async addMembers(gw_id,user_id,gw_dept_id,gw_dept_name,member_type,is_leader){
    const {ctx,app} = this;
    var create_user = ctx.user.user_id;
    var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
    app.mysql.query('insert into doc_deal_member(user_id,gw_id,gw_dept_id,gw_dept_name,member_type,is_leader,create_user,create_at) values(?,?,?,?,?,?,?,?)',[user_id,gw_id,gw_dept_id,gw_dept_name,member_type,is_leader,create_user,create_at]);
  }
  async delUndertake(gw_id,user_id,gw_dept_id){
    var app = this.app;
    app.mysql.query('delete from doc_deal_topic where gw_id = ?',gw_id);
    app.mysql.query('delete from doc_deal where gw_id = ?',gw_id);
    app.mysql.query('delete from doc_deal_member where user_id =? and gw_id = ? and gw_dept_id = ?',[user_id,gw_id,gw_dept_id]);
    app.mysql.query('delete from doc_urge where gw_id = ?',gw_id);
    app.mysql.query('delete from doc_deal_topic_user where user_id = ?',user_id);
  }
  async getFiles(gw_id){
    var app = this.app;
    var result = await app.mysql.query('select fs.file_id,fs.file_type,fs.original_name,fs.file_path,fs.file_name,obj_id from doc_file df,wapp.files fs where df.gw_file_id = fs.file_id and df.gw_id = ?',gw_id);
    return result;
  }
}

module.exports = DocService;
