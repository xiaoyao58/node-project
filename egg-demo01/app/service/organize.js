'use strict';
const uuid = require('uuid');
const _ = require('lodash');
const moment = require('moment');
const Service = require('egg').Service;

class OrganizeService extends Service {
  async getGwDept() {
    var result = await this.app.mysql.query('select gw_dept_id,gw_dept_name,parent_id,dept_id,path_id,path_name,gw_dept_type,gw_dept_sort,is_view from doc_dept');
    return result;
  }
  async getGwDept(gw_dept_id) {
    var result = await this.app.mysql.query('select gw_dept_id,gw_dept_name,parent_id,dept_id,path_id,path_name,gw_dept_type,gw_dept_sort,is_view from doc_dept where gw_dept_id = ?', gw_dept_id);
    return result;
  }

  async get_path_name(parent_id, path_name,all_parent_id) {
    var path_name = path_name;
    var all_parent_id = all_parent_id;
    var app = this.app;
    var result = {};
    try {
      var parent_dept = await app.mysql.query('select gw_dept_name,parent_id from doc_dept where gw_dept_id = ?', parent_id);
      if (!_.isEmpty(parent_dept)) {
        var parent_dept_name = parent_dept[0].gw_dept_name;
        var p_dept_parent_id = parent_dept[0].parent_id;
        path_name = parent_dept_name + '>' + path_name;
        all_aprent_id = p_dept_parent_id + '>' + all_parent_id;
        parent_id = parent_dept[0].parent_id;
        if (!_.isEmpty(parent_id)) {
          return this.get_path_name(parent_id, path_name,all_parent_id);//在递归时，一定要return递归函数,否则得到的将会是undefined值
        } else {
          result = {
            path_name:path_name,
            parent_id: parent_id
          }
          return result;
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async addGwDept(gw_dept_id, dept_id, is_sub, parent_id, gw_dept_type, gw_dept_sort) {
    var app = this.app;
    var ctx = this.ctx;
    var path_id = uuid.v4();
    var gw_dept_name = await app.mysql.query('select dept_name from wdzt.dept where dept_id = ?', dept_id);
    gw_dept_name = gw_dept_name[0].dept_name;
    var path_name = '';
    var parent_id = parent_id;
    if (!_.isEmpty(parent_id)) {
      var parent = await ctx.service.organize.get_path_name(parent_id, '','');
      path_name = parent.path_name + gw_dept_name;
      patent_id = parent.parent_id + parent_id;
    } else {
      path_name = gw_dept_name;
      parent_id = parent_id;
    }
    var is_view = 1;
    var remind_interval = 48;
    var sw_level = null;
    var is_sw = null;
    var fw_short = null;
    var create_user = ctx.user.user_id;
    var project_id = ctx.user.project_id;
    var sw_flow_id = null;
    var fw_flow_id = null;
    var qb_flow_id = null;
    var is_dc = null;
    var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      app.mysql.query('insert into doc_dept(gw_dept_id,dept_id,gw_dept_name,gw_dept_type,gw_dept_sort,path_id,path_name,parent_id,is_view,remind_interval,sw_level,is_sw,fw_short,create_user,create_at,project_id,sw_flow_id,fw_flow_id,qb_flow_id,is_dc) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [gw_dept_id, dept_id, gw_dept_name, gw_dept_type, gw_dept_sort, path_id, path_name, parent_id, is_view, remind_interval, sw_level, is_sw, fw_short, create_user, create_at, project_id, sw_flow_id, fw_flow_id, qb_flow_id, is_dc]);
    } catch (error) {
      this.logger.error(error);
    }
  }
  async delGwDept(gw_dept_id) {
    var app = this.app;
    try {
      app.mysql.query('delete from doc_dept where gw_dept_id = ?', gw_dept_id);
    } catch (error) {
      this.logger.error(error);
    }

  }
  async editGwDept(gw_dept_id, gw_dept_name, gw_dept_type, is_view, gw_dept_sort) {
    var app = this.app;
    var dept = await app.mysql.query('select gw_dept_name,gw_dept_type,is_view,gw_dept_sort from doc_dept where gw_dept_id = ?', gw_dept_id);
    if (!_.isEmpty(dept)) {
      if (_.isEmpty(gw_dept_name)) {
        var gw_dept_name = dept[0].gw_dept_name;
      }
      if (_.isEmpty(gw_dept_type)) {
        var gw_dept_type = dept[0].gw_dept_type;
      }
      if (_.isEmpty(is_view)) {
        var is_view = dept[0].is_view;
      }
      if (_.isEmpty(gw_dept_sort)) {
        var gw_dept_sort = dept[0].gw_dept_sort;
      }
    }
    app.mysql.query('update doc_dept set gw_dept_name = ?,gw_dept_type = ?,is_view = ?,gw_dept_sort = ? where gw_dept_id = ?', [gw_dept_name, gw_dept_type, is_view, gw_dept_sort, gw_dept_id]);
  }
  async editParent(gw_dept_id, parent_id) {
    var app = this.app;
    var dept = await app.mysql.query('select gw_dept_name from doc_dept where gw_dept_id = ?', gw_dept_id);
    var gw_dept_name = dept[0].gw_dept_name;
    var path_name = await get_path_name(parent_id,'','');
    path_name = path_name + '>' + gw_dept_name;
    app.mysql.query('update doc_dept set parent_id = ?,path_name = ? where gw_dept_id = ?', [parent_id, path_name, gw_dept_id]);
  }

  async getDeptRel(gw_dept_id) {
    var app = this.app;
    var result = await app.mysql.query('select rel_dept_id,rel_dept_name,unit_short,is_sw,is_fw_unit,is_fw_dept,fw_dept_level,status from doc_dept_rel where gw_dept_id = ?', gw_dept_id);
    return result;
  }
  async getFwType(gw_dept_id) {
    var app = this.app;
    var result = await app.mysql.query('select dft.fw_type_id,dft.res_id,dft.res_name,dft.seal_file_id,dft.tem_file_id,dft.rel_dept_id from doc_dept_fw_type dft,doc_dept_rel dr where dft.rel_dept_id = dr.rel_dept_id and dr.gw_dept_id = ?', gw_dept_id);
    return result;
  }
  async getCluster(gw_dept_id) {
    var result = await this.app.mysql.query('select dc.cluster_id,dc.cluster_name,dc.rel_dept_id from doc_dept_cluster dc,doc_dept_rel dr where dc.rel_dept_id = dr.rel_dept_id and dr.gw_dept_id = ?', gw_dept_id);
    return result;
  }
  async getClusterRel(gw_dept_id) {
    var result = await this.app.mysql.query('select d.gw_dept_id,d.gw_dept_name,dcr.cluster_id from doc_dept_cluster_rel dcr,doc_dept d where dcr.gw_dept_id = d.gw_dept_id and dcr.gw_dept_id = ?', gw_dept_id);
    return result;
  }
  async getFiles() {
    var app = this.app;
    var result = await app.mysql.query('select file_id,file_type,original_name,file_path,file_name from wapp.files');
    return result;
  }
  async getFwType() {
    var app = this.app;
    var result = await app.mysql.query('select * from dic_fw_type');
    return result;
  }
  async addDeptRel(rel_dept_id, gw_dept_id, rel_dept_name, unit_short, is_sw, is_fw_unit, is_fw_dept, fw_dept_level, status, create_user, create_at) {
    const { ctx, app } = this;
    app.mysql.query('insert into doc_dept_rel(rel_dept_id,gw_dept_id,rel_dept_name,unit_short,is_sw,is_fw_unit,is_fw_dept,fw_dept_level,status,create_at,create_user) values(?,?,?,?,?,?,?,?,?,?,?)', [rel_dept_id, gw_dept_id, rel_dept_name, unit_short, is_sw, is_fw_unit, is_fw_dept, fw_dept_level, status, create_at, create_user]);
  }

  async addFwType(fw_type_id, rel_dept_id, res_id, res_name, seal_file_id, tem_file_id, is_fw_dept, fw_dept_level, create_user, create_at) {
    const { ctx, app } = this;
    app.mysql.query('insert into doc_dept_fw_type(fw_type_id,rel_dept_id,res_id,res_name,seal_file_id,tem_file_id,is_fw_dept,fw_dept_level,create_user,create_at) values(?,?,?,?,?,?,?,?)', [fw_type_id, rel_dept_id, res_id, res_name, seal_file_id, tem_file_id, is_fw_dept, fw_dept_level, create_user, create_at]);
  }

  async addCluster(cluster_id, rel_dept_id, cluster_name, create_user, create_at) {
    const { ctx, app } = this;
    app.mysql.query('insert into doc_dept_cluster(cluster_id,rel_dept_id,cluster_name,create_user,create_at) values(?,?,?,?,?)', [cluster_id, rel_dept_id, cluster_name, create_user, create_at]);
  }

  async addDeptClusterRel(gw_dept_id, cluster_id, create_user, create_at) {
    const { ctx, app } = this;
    app.mysql.query('insert into doc_dept_cluster_rel(gw_dept_id,cluster_id,create_at,create_user) values(?,?,?,?)', [gw_dept_id, cluster_id, create_at, create_user]);
  }

  async DRRel(gw_dept_id, rel_dept_id, t) {
    const app = this.app;
    app.mysql.query('update doc_dept_id set status = ? where gw_dept_id = ? and rel_dept_id = ?', [t, gw_dept_id, rel_dept_id]);
  }

  async editRel(rel_dept_id, rel_dept_name, unit_short, is_sw, is_fw_unit) {
    const app = this.app;
    var args_rel = [rel_dept_id, rel_dept_name, unit_short, is_sw, is_fw_unit];
    var args = [];
    var sql = "update doc_dept_rel set";
    _.forEach(args_rel, (ar) => {
      if (!_.isEmpty(ar)) {
        sql = sql + ar + '=?,';
        args.push(ar);
      }
    });
    sql = sql.substring(0, sql.lastIndexOf(','));
    app.mysql.query(sql, args);
  }

  async editFwType(fw_type_id, rel_dept_id, res_id, res_name, seal_file_id, tem_file_id, is_fw_dept, fw_dept_level) {
    var app = this.app;
    if (!_.isEmpty(res_id))
      app.mysql.query('update doc_dept_fw_type set res_name=?,seal_file_id=?,tem_file_id=?,is_fw_dept=?,fw_dept_level=? where fw_type_id = ? and rel_dept_id = ?,res_id = ?', [res_name, seal_file_id, tem_file_id, is_fw_dept, fw_dept_level, fw_type_id, rel_dept_id, res_id]);
    if (_.isEmpty(res_id))
      app.mysql.query('update doc_dept_fw_type set res_name=?,seal_file_id=?,tem_file_id=?,is_fw_dept=?,fw_dept_level=? where fw_type_id = ? and rel_dept_id = ?', [res_name, seal_file_id, tem_file_id, is_fw_dept, fw_dept_level, fw_type_id, rel_dept_id]);
  }

  async editCluster(cluster_id, rel_dept_id, cluster_name) {
    var app = this.app;
    app.mysql.query('update doc_dept_cluster set cluster_name = ? where cluster_id =? and rel_dept_id = ?', [cluster_name, cluster_id, rel_dept_id]);
  }

  async addAuth(gw_dept_id,user_id,right_code,create_at){
    var app = this.app;
    app.mysql.query('insert into doc_user_auth(gw_dept_id,user_id,right_code,create_at) values(?,?,?,?);',[gw_dept_id,user_id,right_code,create_at]);
  }

  async getAuth(gw_dept_id,page_index,page_size){
    var page_index = (!_.isEmpty(page_index))?parseInt(page_index):1;
    var page_size = (!_.isEmpty(page_size))?parseInt(page_size):20;
    var limit = page_size;
    var offset = page_size*(page_index - 1);
    var result = {};
    result.funs = [];
    result.list = [];
    var funs = await this.app.mysql.query('select fun_id,fun_name from dic_doc_fun');
    if(!_.isEmpty(funs)){
      _.forEach(funs,(f)=>{
        var fun = {};
        fun.fun_id = f.fun_id;
        fun.fun_name = f.fun_name;
        result.funs.push(fun);
      });
    }
    var auth = await this.app.mysql.query('select ua.right_code,u.user_id,u.`name`,u.avatar,u.job_number from doc_user_auth ua,wdzt.users u where ua.user_id = u.user_id and gw_dept_id = ? limit ? offset ?',[gw_dept_id,limit,offset]);
    if(!_.isEmpty(auth)){
      _.forEach(auth,(a)=>{
        var user = {};
        user.user_id = a.user_id;
        user.name = a.name;
        user.avatar = a.avatar;
        user.job_number = a.job_number;
        user.right_code = a.right_code;
        result.list.push(user);
      });
    }
    return result;
  }

  async delAuth(gw_dept_id,user_id){
    var app = this.app;
    try {
      app.mysql.query('delete from doc_user_auth where gw_dept_id = ? and user_id = ?',[gw_dept_id,user_id]);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async editAuth(gw_dept_id,user_id,right_code){
    var app = this.app;
    try {
      app.mysql.query('update doc_user_auth set right_code = ? where gw_dept_id = ? and user_id = ?',[right_code,gw_dept_id,user_id]);
    } catch (error) {
      this.logger.error(error);
    }
  }


  //获取下属部门
  async getSonDept(gw_dept_id){
    var result = [];
    var app = this.app;
    var depts = await app.mysql.query('select gw_dept_id,parent_id,gw_dept_name,path_name,gw_dept_sort,fw_short from doc_dept where path_id like ?',"%"+gw_dept_id+"%");
    if(!_.isEmpty(depts)){
      _.forEach(depts,(d)=>{
        var dept = {};
        dept.gw_dept_id = d.gw_dept_id;
        dept.parent_id = d.parent_id;
        dept.gw_dept_name = d.gw_dept_name;
        dept.path_name = d.path_name;
        dept.gw_dept_sort = d.gw_dept_sort;
        dept.fw_short = d.fw_short;
        result.push(dept);
      });
    }
    return depts;
  }
  //获取发文流程
  async getFwDetail(gw_dept_id){
    var app = this.app;
    var result = {};
    result.list = [];
    try{
      var activities = await app.mysql.query('select ac.flow_id,ac.activity_id,ac.display_name,ac.activity_type from doc_activity ac,doc_app da,doc_fw df where df.fw_id = da.app_uuid and ac.app_uuid = da.app_uuid and df.gw_dept_id = ?',gw_dept_id);
      if(!_.isEmpty(activities)){
        console.log(activities);
        _.forEach(activities,(ac)=>{
          var active = {};
          active.flow_id = ac.flow_id;
          active.activity_id = ac.activity_id;
          active.display_name = ac.display_name;
          active.activity_type = ac.activity_type;
          result.list.push(active);
        });
      }
      // console.log(result);
      return result;
    }catch(error){
      this.logger.error(error);
      console.log(error);
    }
  }

  //获取收文流程
  async getSwDetail(gw_dept_id){
    var app = this.app;
    var result = {};
    result.list = [];
    try{
      var activities = await app.mysql.query('select ac.flow_id,ac.activity_id,ac.display_name,ac.activity_type from doc_activity ac,doc_app da,doc_sw ds where ds.sw_id = da.app_uuid and ac.app_uuid = da.app_uuid and ds.gw_dept_id = ?',gw_dept_id);
      if(!_.isEmpty(activities)){
        _.forEach(activities,(ac)=>{
          var active = {};
          active.flow_id = ac.flow_id;
          active.activity_id = ac.activity_id;
          active.display_name = ac.display_name;
          active.activity_type = ac.activity_type;
          result.list.push(active);
        });
      }
      return result;
    }catch(error){
      this.logger.error(error);
      console.log(error);
    }
  }
}

module.exports = OrganizeService;
