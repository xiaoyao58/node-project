'use strict';
var _ = require('lodash');
const moment = require('moment');
const uuid = require('uuid');
const httpbase = "https://wdzt5.wondersgroup.com/";
const Controller = require('egg').Controller;

class OrganizeController extends Controller {
  //获取公文组织架构表
  async getGwDept() {
    var ctx = this.ctx;
    var depts = await ctx.service.organize.getGwDept();
    var result = {};
    result.list = [];

    if (!_.isEmpty(depts)) {
      _.forEahc(depts, (d) => {
        var dept = {};
        dept.gw_dept_id = d.gw_dept_id;
        dept.gw_dept_name = d.gw_dept_name;
        dept.parent_id = d.parent_id;
        dept.path_id = d.path_id;
        dept.path_name = d.path_name;
        dept.gw_dept_type = d.gw_dept_type;
        dept.gw_dept_sort = d.gw_dept_sort;
        dept.is_view = d.is_view;
        dept.is_del = d.is_del;
        result.list.push(dept);
      });
    }
    return ctx.response.body = result;
  }
  //创建公文组织架构表
  async addGwDept() {
    var ctx = this.ctx;
    var dept_id = ctx.request.body.dept_id;
    var gw_dept_id = uuid.v4();

    var result = {};
    if (_.isEmpty(dept_id)) {
      return ctx.body = {
        error_desc: 'dept_id can not null'
      }
    }
    var is_sub = ctx.request.body.is_sub ? ctx.request.body.is_sub : null;
    var parent_id = ctx.request.body.parent_id ? ctx.request.body.parent_id : '';
    var gw_dept_type = ctx.request.body.gw_dept_type ? ctx.request.body.gw_dept_type : null;
    var gw_dept_sort = ctx.request.body.gw_dept_sort ? ctx.request.body.gw_dept_sort : null;
    try {
      await ctx.service.organize.addGwDept(gw_dept_id, dept_id, is_sub, parent_id, gw_dept_type, gw_dept_sort);
      result.gw_dept_id = gw_dept_id;
      ctx.response.body = result;
    } catch (error) {
      this.logger.error(error);
    }
  }
  //删除公文部门
  async delGwDept() {
    var ctx = this.ctx;
    var gw_dept_id = ctx.request.body.gw_dept_id;
    try {
      var res = await ctx.service.organize.delGwDept(gw_dept_id);
    } catch (err) {
      this.logger.error(err);
      return;
    }
  }

  //编辑公文部门
  async editGwDept() {
    var ctx = this.ctx;
    var gw_dept_id = ctx.request.body.gw_dept_id;
    var gw_dept_name = ctx.request.body.gw_dept_name;
    var gw_dept_type = ctx.request.body.gw_dept_type;
    var is_view = ctx.request.body.is_view;
    var gw_dept_sort = ctx.request.body.gw_dept_sort;

    var result = {};
    result.gw_dept_id = gw_dept_id;
    try {
      await ctx.service.organize.editGwDept(gw_dept_id, gw_dept_name, gw_dept_type, is_view, gw_dept_sort);
      ctx.response.body = result;
    } catch (err) {
      this.logger.error(err);
      return ctx.response.body = {
        error_code: 1,
        error_desc: 'edit gw_dept fail'
      }
    }
  }
  //公文部门编辑父节点
  async editParent() {
    var ctx = this.ctx;
    var gw_dept_id = ctx.request.body.gw_dept_id;
    var parent_id = ctx.reqeust.body.parent_id ? ctx.request.body.parent_id : null;

    var result = {};
    result.list = [];
    try {
      var depts = await ctx.service.organize.editParent(gw_dept_id, parent_id);
      if (!_.isEmpty(depts)) {
        _.forEach(depts, (d) => {
          var dept = {};
          dept.gw_dept_id = d.gw_dept_id;
          dept.parent_id = d.parent_id;
          dept.dept_id = d.dept_id;
          dept.gw_dept_name = d.gw_dept_name;
          dept.path_id = d.path_id;
          dept.path_name = d.path_name;
          dept.gw_dept_type = d.gw_dept_type;
          dept.gw_dept_sort = d.gw_dept_sort;
          dept.is_view = d.is_view;
          result.list.push(dept);
        });
      }
    } catch (err) {
      this.logger.error(err);
    } finally {
      ctx.response.body = result;
    }
  }
  async getDeptRel() {
    var ctx = this.ctx;
    var gw_dept_id = ctx.request.body.gw_dept_id;
    var fw_type = await ctx.service.organize.getFwType();
    var dept_rel = await ctx.service.organize.getDeptRel(gw_dept_id);
    var fw_type = await ctx.service.organize.getFwType(gw_dept_id);
    var cluster = await ctx.service.organize.getCluster(gw_dept_id);
    var clusterRel = await ctx.service.organize.getClusterRel(gw_dept_id);
    var files = await ctx.service.organize.getFiles();

    var result = {};
    result.fw_type = [];
    result.list = [];

    if (!_.isEmpty(fw_type)) {
      _.forEach(fw_type, (ft) => {
        var fw = {};
        fw.fw_type_id = ft.fw_type_id;
        fw.fw_type_name = ft.fw_type_name;
        fw.short = ft.short;
        fw.info = ft.info;
        result.fw_type.push(fw);
      })
    }

    try {
      if (!_.isEmpty(dept_rel)) {
        _.forEach(dept_rel, (dr) => {
          var dept_r = {};
          dept_r.rel_dept_id = dr.rel_dept_id;
          dept_r.rel_dept_name = dr.rel_dept_name;
          dept_r.unit_short = dr.unit_short;
          dept_r.is_sw = dr.is_sw;
          dept_r.is_fw_unit = dr.is_fw_unit;
          dept_r.type = [];
          dept_r.cluster = [];

          fw_type = _.filter(fw_type, (ft) => {
            return ft.rel_dept_id == dr.rel_dept_id;
          });
          if (!_.isEmpty(fw_type)) {
            _.forEach(fw_type, (ft) => {
              var type = {};
              type.fw_type_id = ft.fw_type_id;
              type.res_id = ft.res_id;
              type.res_name = ft.res_name;
              type.seal_file = {};
              type.tem_file = {};
              var files1 = _.filter(files, (f) => {
                return f.file_id == ft.seal_file_id;
              });
              if (!_.isEmpty(files1)) {
                _.forEach(files1, (f) => {
                  var file = {};
                  file.file_id = f.file_id;
                  file.file_type = f.file_type;
                  file.original_name = f.original_name;
                  file.file_url = httpbase + f.file_path + f.file_name;
                  file.thumb_url = httpbase + f.file_path + 'thumb_' + f.file_name;
                  type.seal_file = file;
                });
              }
              var files2 = _.filter(files, (f) => {
                return f.file_id == ft.tem_file_id;
              });
              if (!_.isEmpty(files2)) {
                _.forEach(files2, (f) => {
                  var file = {};
                  file.file_id = f.file_id;
                  file.file_type = f.file_type;
                  file.original_name = f.original_name;
                  file.file_url = httpbase + f.file_path + f.file_name;
                  file.thumb_url = httpbase + f.file_path + 'thumb_' + f.file_name;
                  type.tem_file = file;
                });
              }
              dept_r.type.push(type);
            });
          }
          if (!_.isEmpty(cluster)) {
            cluster = _.filter(cluster, (c) => {
              return c.rel_dept_id == dr.rel_dept_id;
            });
            _.forEach(cluster, (c) => {
              var clus = {};
              clus.cluster_id = c.cluster_id;
              clus.cluster_name = c.cluster_name;
              clus.depts = [];
              if (!_.isEmpty(clusterRel)) {
                clusterRel = _.filter(clusterRel, (cr) => {
                  return cr.cluster_id == c.cluster_id;
                });
                _.forEach(clusterRel, (cr) => {
                  var clusR = {};
                  clusR.gw_dept_id = cr.gw_dept_id;
                  clusR.gw_dept_name = cr.gw_dept_name;
                  clus.depts.push(clusR);
                });
              }
              dept_r.cluster.push(clus);
            });
          }
          dept_r.is_fw_dept = dr.is_fw_dept;
          dept_r.fw_dept_level = dr.fw_dept_level;
          dept_r.status = dr.status;
          result.list.push(dept_r);
        });
      }
    } catch (error) {
      this.logger.error(error);
    } finally {
      ctx.body = result;
    }
  }
  //关联单位创建
  async addDeptRel() {
    var ctx = this.ctx;
    var req = ctx.request.body;
    var rel_dept_id = uuid.v4();
    var cluster_id = uuid.v4();
    var gw_dept_id = req.gw_dept_id;
    var rel_dept_name = req.rel_dept_name;
    var unit_short = req.unit_short;
    var is_sw = req.is_sw;
    var is_fw_unit = req.is_fw_unit;
    var is_fw_dept = req.is_fw_dept ? req.is_fw_dept : null;
    var fw_dept_level = req.fw_dept_level ? req.fw_dept_level : null;
    var status = null;

    var create_user = ctx.user.user_id;
    var create_at = moment().format('YYYY-MM-DD HH:mm:ss');

    var fw_type = req.fw_type;
    var cluster = req.cluster;

    try {
      ctx.service.organize.addDeptRel(rel_dept_id, gw_dept_id, rel_dept_name, unit_short, is_sw, is_fw_unit, is_fw_dept, fw_dept_level, status, create_user, create_at);
      _.forEach(fw_type, (ft) => {
        ctx.service.organize.addFwType(ft.fw_type_id, rel_dept_id, ft.res_id, ft.res_name, ft.seal_file_id, ft.tem_file_id, ft.is_fw_dept, ft.fw_dept_level, create_user, create_at);
      });
      _.forEach(cluster, (c) => {
        ctx.service.organize.addCluster(cluster_id, rel_dept_id, c.cluster_name, create_user, create_at);
        _.forEach(c.depts, (d) => {
          ctx.service.organize.addDeptClusterRel(d.gw_dept_id, cluster_id, create_user, create_at);
        });
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
  async DRRel() {
    var ctx = this.ctx;
    var req = ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var rel_dept_id = req.rel_dept_id;
    var t = req.r;
    try {
      ctx.service.organize.DRRel(gw_dept_id, rel_dept_id, t);
    } catch (error) {
      this.logger.error(error);
    }
    ctx.response.body = gw_dept_id;
  }
  //编辑关联单位
  async editRel() {
    const ctx = this.ctx;
    var req = ctx.request.body;
    var service = ctx.service.organize;
    var rel_dept_id = req.rel_dept_id;
    var rel_dept_name = req.rel_dept_name;
    var unit_short = req.unit_short;
    var is_sw = req.is_sw;
    var is_fw_unit = req.is_fw_unit;
    var cluster_id = uuid.v4();

    var create_user = ctx.user.user_id;
    var create_at = moment().format('YYYY-MM-DD HH:mm:ss');

    var fw_type = req.fw_type;
    var cluster = req.cluster;

    try {
      service.editRel(rel_dept_id, rel_dept_name, unit_short, is_sw, is_fw_unit);
      if (!_.isEmpty(fw_type)) {
        _.forEach(fw_type, (ft) => {
          service.editFwType(ft.fw_type_id, rel_dept_id, ft.res_id, ft.res_name, ft.seal_file_id, ft.tem_file_id, ft.is_fw_dept, ft.fw_dept_level);
        });
      }
      if (!_.isEmpty(cluster)) {
        _.forEach(cluster, (c) => {
          if (!_.isEmpty(c.cluster_id))
            service.editCluster(c.cluster_id, rel_dept_id, c.cluster_name);
          if (_.isEmpty(c.cluster_id)) {
            service.addCluster(cluster_id, rel_dept_id, c.cluster_name);
            if (!_.isEmpty(c.depts)) {
              _.forEach(c.depts, (d) => {
                service.addDeptClusterRel(d.gw_dept_id, cluster_id, create_user, create_at);
              });
            }
          }
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
    ctx.response.body = rel_dept_id;
  }
  //新增授权人员
  async addAuth() {
    var req = this.ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var user_id = req.user_id;
    var right_code = req.right_code;
    var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
    await this.ctx.service.organize.addAuth(gw_dept_id, user_id, right_code, create_at);
  }

  //功能授权列表
  async getAuth() {
    var ctx = this.ctx;
    var req = ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var page_index = req.page_index;
    var page_size = req.page_size;
    var result = await ctx.service.organize.getAuth(gw_dept_id, page_index, page_size);
    ctx.response.body = result;
  }

  //功能授权移除
  async delAuth() {
    var ctx = this.ctx;
    var req = ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var user_id = req.user_id;
    try {
      ctx.service.organize.delAuth(gw_dept_id, user_id);
      // ctx.response.body = gw_dept_id;
    } catch (error) {
      this.logger.error(error);
    }
  }

  //功能授权编辑
  async editAuth(){
    var ctx = this.ctx;
    var req = ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var user_id = req.user_id;
    var right_code = req.right_code;
    try{
      ctx.service.organize.editAuth(gw_dept_id,user_id,right_code);
      ctx.reponse.body = gw_dept_id;
    }catch(error){
      this.logger.error(error);
    }
  }

  //发文设置详情
  async getFwSet(){
    var ctx = this.ctx;
    var req = ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var result = {};
    try {
    var fw_dept = await ctx.service.organize.getSonDept(gw_dept_id);
    result.fw_dept = fw_dept;
    var activities = await ctx.service.organize.getFwDetail(gw_dept_id);
    console.log(activities);
    result.activities = activities;
    ctx.response.body = result;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
    }
    
  }

  //收文设置详情
  async getSwSet(){
    var ctx = this.ctx;
    var req = ctx.request.body;
    var gw_dept_id = req.gw_dept_id;
    var result = {};
    try {
    var fw_dept = await ctx.service.organize.getSonDept(gw_dept_id);
    result.fw_dept = fw_dept;
    var activities = await ctx.service.organize.getSwDetail(gw_dept_id);
    result.activities = activities;
    ctx.response.body = result;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
    }
    
  }
}
module.exports = OrganizeController;