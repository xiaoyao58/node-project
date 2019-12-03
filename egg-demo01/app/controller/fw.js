'use strict';

const Controller = require('egg').Controller;

class FwController extends Controller {
  async update() {
    var ctx = this.ctx;
    var req = ctx.request.body;
    var fw_id = req.fw_id;//发文编号
    var gw_dept_id = req.gw_dept_id;//拟稿部门编号
    var gw_dept_name = req.gw_dept_name;//拟稿部门名称
    var draft_user_id = req.user_id;//拟稿人编号
    var user_name = req.user_name;
    var draft_at = req.draft_at;//拟稿日期
    var deadline = req.deadline;//办结期限
    var fw_type_id = req.fw_type_id;//发文类型编号
    var doc_type_id = req.doc_type_id;//文中编号
    var doc_no = req.doc_no;//发文字号
    var doc_level = req.doc_level;//紧急程度
    var print_num = req.print_num;//印制份数
    var title = req.title;//发文标题
    var is_urgent = req.is_urgent;//是否加急办理
    var is_public = req.is_public;//是否公开预览
    var is_archive = req.is_archive;//是否归档
    var remark = req.remark;//备注
    var fws = [gw_dept_id,gw_dept_name,draft_user_id,draft_at,deadline,fw_type_id,doc_type_id,doc_no,doc_level,print_num,title,is_urgent,is_public,is_archive,remark];
    var fw_dept = req.fw_dept;
    var fw_sign = req.fw_sign;
    var fw_report = req.fw_report;
    var activities = req.activities;

    var result = {};
    result.fw_id = fw_id;
    try {
        if(!_.isEmpty(fws))
        ctx.service.fw.update_fw(fw_id,fws);
        if(!_.isEmpty(fw_dept)&&fw_dept !==0){
            _.forEach(fw_dept,(fd)=>{
                ctx.service.fw.update_fw_hg(fw_id,fd.fw_dept_id,fd.fw_dept_name);
            });
        }
        if(fw_dept == 0){
            ctx.service.fw.delete_fw_hg();
        }
        if(!_.isEmpty(fw_sign)){
            _.forEach(fw_sign,(fs)=>{
                ctx.service.fw.update_fw_sign(fs.sign_id,fw_id,fs.rel_dept_id,fs.rel_dept_name,fs.sign_user_id,fs.sign_user_name,fs.sort,fs.sign_at,fs.sign_type);
            });
        }
        if(!_.isEmpty(fw_report)){
            _.forEach(fw_report,(fr)=>{
                ctx.service.fw.update_fw_report(fr.unit_type,fr.gw_dept_id,fr.gw_dept_name,fr.report_id,fw_id);
            });
        }
        if(!_.isEmpty(activities)){
            _.forEach(activities,(ac)=>{
                ctx.service.fw.update_activity(ac.flow_id,ac.activitiy_id,ac.activity_type,ac.display_name,ac.operation_id,ac.operation_display_name,ac.opinion,ac.finish_at,ac.user_id,ac.user_name,ac.gw_dept_id,ac.gw_dept_name,ac.activity_uuid,fw_id);
            });
        }
        ctx.response.body = result;
    } catch (error) {
        this.logger.error(error);
    }
  }

  async doc(){
      var ctx = this.ctx;
      var result = {};
      result.flies = [];
      var fw_id = ctx.request.body.fw_id;
      try {
          result = await ctx.service.fw.doc(fw_id);
          if(!_.isEmpty(result)){
              _.forEach(result,(r)=>{
                  var file = {};
                  file.flie_id = r.file_id;
                  file.file_type=  r.file_type;
                  file.original_name = r.original_name;
                  file.file_url = r.file_url;
                  file.thumb_url = r.thumb_url;
                  file.file_owa = r.file_owa;
                  result.flies.push(file);
              });
              ctx.response.body = result;
          }
      } catch (error) {
          this.logger.error(error);
      }
  }
  async fix_list(){
      var ctx = this.ctx;
      var req = ctx.request.body;
      var title = req.tile?req.tile:null;
      var biz_type_id = req.biz_type_id?req.biz_type_id:null;
      var fw_start = req.fw_start?req.fw_start:null;
      var fw_end = req.fw_end?req.fw_end:null;
      var doc_dept = req.dept?req.doc_dept:null;
      var remark = req.remark?req.remark:null;
      var page_index = req.page_index?parseInt(req.page_index):1;
      var page_size = req.page_size?parseInt(req.page_size):20;
      var limit = page_size;
      var offset = page_size*(page_index-1);

      var result = {};
      try {
        result = await ctx.service.fw.fix_list(title,biz_type_id,fw_start,fw_end,doc_dept,remark,limit,offset);
        ctx.response.body = result;
      } catch (error) {
          this.logger.error(error);
      }
      
      
  }
}

module.exports = FwController;
