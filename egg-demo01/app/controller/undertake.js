'use strict';
var _ = require('lodash');
const moment = require('moment');
const httpbase ="https://wdzt5.wondersgroup.com/";
const Controller = require('egg').Controller;
class UndertakeController extends Controller {
    //承办事项列表
  async getUndertake() {
      const {ctx,app} = this;
      var type = ctx.request.body.t;
      var title = ctx.request.body.title;
      var page_index = ctx.request.body.page_index?parseInt(ctx.request.body.page_index):1;
      var page_size = ctx.request.body.page_size?parseInt(ctx.request.body.page_size):20;
      var start = page_size*(page_index-1);
      var end = start+page_size;
      var result = {};
      result.list = []
    var datas = await ctx.service.undertake.getUndertake();
    if(!_.isEmpty(datas)){
        _.forEach(datas,(d)=>{
            var u = {};
            u.app_uuid = d.app_uuid;
            u.activity_uuid = d.activity_uuid;
            u.gw_id = d.gw_id;
            u.title = d.title;
            u.biz_type = {
                biz_type_id : d.biz_type_id,
                biz_type_name : d.biz_type_name
            }
            u.is_urgent = d.is_urgent;
            u.is_dc = d.is_dc;
            u.dept = {
                gw_dept_id: d.gw_dept_id,
                gw_dept_name: d.gw_dept_name
            }
            u.deadline = d.deadline;
            u.complete_at = d.finish_at;
            result.list.push(u);
        });
    }
    if(!_.isEmpty(type)){
        result.list = _.filter(result.list,(rl)=>{
            return rl.biz_type.biz_type_id == type;
        });
    }
    if(!_.isEmpty(title)){
        result.list = _.filter(result.list,(rl)=>{
            return rl.title.indexOf(title) !==0;
        });
    }
    result.list = result.list.slice(start,end);
    ctx.body = result;
  }
  //承办讨论列表
  async getTopic(){
      const ctx = this.ctx;
      var gw_id = ctx.request.body.gw_id;
      var keyword = ctx.request.body.keyword;
      var date_start = ctx.request.body.start;
      var date_end = ctx.request.body.end;
      var page_index = ctx.request.body.page_index?parseInt(ctx.request.body.page_index):1;
      var page_size = ctx.request.body.page_size?parseInt(ctx.request.body.page_size):20;
      var limit = page_size;
      var offset = page_size*(page_index-1);

      var result = {};
      result.list = [];

      var data = await ctx.service.undertake.getTopic(gw_id,limit,offset);
      var files = await ctx.service.undertake.getFiles(gw_id);
    
      if(!_.isEmpty(data)){
        _.forEach(data,(d)=>{
            var topic = {};
            if(_.isEmpty(d.reply_topic_id)){
                topic.topic_id = d.topic_id;
                topic.message =  d.message;
                topic.topic_type = d.topic_type;
                topic.create_user = {
                    user_id: d.create_user,
                    name: d.name,
                    avatar: d.avatar
                }
                topic.create_at = moment(d.create_at).format('YYYY-MM-DD HH:mm:ss');
            }
            if(!_.isEmpty(d.reply_topic_id)){
                topic.reply = {
                    topic_id: d.topic_id,
                    message: d.message,
                    create_user : {
                        user_id: d.create_user,
                        name: d.name
                    },
                    create_at: moment(d.create_at).format('YYYY-MM-DD HH:mm:ss')
                }
            }
            topic.files = [];
            files = _.filter(files,(f)=>{
                return f.obj_id == topic.topic_id;
            });
            if(!_.isEmpty(files)){
                _.forEach(files,(f)=>{
                  var file = {};
                  file.file_id = f.file_id;
                  file.file_type = f.file_type;
                  file.original_name = f.original_name;
                  file.file_url = httpbase+f.file_path+f.file_name;
                  file.thumb_url = httpbase+f.file_path+'thumb_'+f.file_name;
                  topic.files.push(file);
                });
            }
            result.list.push(topic);
        });
      }else{
        result.list = [];
      }
      if(!_.isEmpty(keyword)){
          result.list = _.filter(result.list,(rl)=>{
              return rl.message.indexOf(keyword) !== 0;
          });
      }
      if(!_.isEmpty(date_start)&&!_.isEmpty(date_end)){
          result.list = _.filter(result.list,(rl)=>{
              return rl.create_at >=date_start && rl.create_at<=data_end;
          });
      }
      console.log(result);
      ctx.response.body = result;
  }
//承办讨论成员信息
  async getMembers(){
      var ctx = this.ctx;
      var gw_id = ctx.request.body.gw_id;
      var memFw = await ctx.service.undertake.getMemFw(gw_id);
      var memHg = await ctx.service.undertake.getMemHg(gw_id);
      var memTopic = await ctx.service.undertake.getMemTopic(gw_id);
      var members = await ctx.service.undertake.getMembers(gw_id);
      var files = await ctx.service.undertake.getFiles(gw_id);

      var result = {};
      result.dept = {};
      result.dept.gw_dept_id = null;
      result.dept.gw_dept_name = null;
      result.dept.members = [];
      result.co_dept = [];
      result.list = [];

      
      if(!_.isEmpty(memFw)){
          result.dept.gw_dept_id = memFw[0].gw_dept_id;
          result.dept.gw_dept_name = memFw[0].gw_dept_name;
          var members = _.filter(members,(m)=>{
              return m.gw_dept_id === memFw[0].gw_dept_id;
          });
          if(!_.isEmpty(members)){
              result.dept.members =[];
              _.forEach(members,(m)=>{
                var mem = {};
                mem.user_id = m.user_id;
                mem.name = m.name;
                mem.avatar = m.avatar;
                mem.is_leader = m.is_leader;
                result.dept.members.push(mem);
              });
          }
      }else{
          result.dept = {};
      }
      if(!_.isEmpty(memHg)){
          _.forEach(memHg,(hg)=>{
              var h = {};
              h.gw_dept_id = hg.gw_dept_id;
              h.gw_dept_name = hg.gw_dept_name;
              h.members = [];
              if(!_.isEmpty(members)){
                  members = _.filter(members,(m)=>{
                    return m.gw_dept_id === hg.gw_dept_id;
                  });
                _.forEach(members,(m)=>{
                    var mem = {};
                    mem.user_id = m.user_id;
                    mem.name = m.name;
                    mem.avatar = m.avatar;
                    h.members.push(mem);
                });
              }
              result.co_dept.push(h);
          });
      }else{
          result.co_dept = [];
      }
      if(!_.isEmpty(memTopic)){
          _.forEach(memTopic,(t)=>{
            var tp = {};
            if(_.isEmpty(t.reply_topic_id)){
                tp.topic_id = t.topic_id;
                tp.message = t.message;
                tp.topic_type = t.topic_type;
                tp.create_user ={
                    user_id: t.create_user,
                    name: t.name,
                    avatar: t.avatar
                }
                files = _.filter(files,(f)=>{
                    return f.obj_id == tp.topic_id;
                });
                tp.files = [];
                if(!_.isEmpty(files)){
                    _.forEach(files,(f)=>{
                      var file = {};
                      file.file_id = f.file_id;
                      file.file_type = f.file_type;
                      file.original_name = f.original_name;
                      file.file_url = httpbase+f.file_path+f.file_name;
                      file.thumb_url = httpbase+f.file_path+'thumb_'+f.file_name;
                      tp.files.push(file);
                    });
                }
            }
           if(!_.isEmpty(t.reply_topic_id)){
            tp.reply = {
                topic_id: t.reply_topic_id,
                message: t.message,
                create_user:{
                    user_id: t.user_id,
                    name: t.name
                }
            }
            files = _.filter(files,(f)=>{
                return f.obj_id == tp.reply.topic_id;
            });
            tp.reply.files = [];
            if(!_.isEmpty(files)){
                _.forEach(files,(f)=>{
                  var file = {};
                  file.file_id = f.file_id;
                  file.file_type = f.file_type;
                  file.original_name = f.original_name;
                  file.file_url = httpbase+f.file_path+f.file_name;
                  file.thumb_url = httpbase+f.file_path+'thumb_'+f.file_name;
                  tp.reply.files.push(file);
                });
            }
           }
            result.list.push(tp);
          });
      }else{
          result.list = [];
      }
      ctx.response.body = result;
  }

  //承办日志表
  async getLogs(){
      var ctx = this.ctx;
      var gw_id = ctx.request.body.gw_id;
      var page_index = ctx.request.body.page_index?parseInt(ctx.request.body.page_index):1;
      var page_size = ctx.request.body.page_size?parseInt(ctx.request.body.page_size):20;
      var limit = page_size;
      var offset = page_size*(page_index-1);
      var data = await ctx.service.undertake.getLogs(gw_id,limit,offset);
      
      var result = {};
      result.list = [];
      if(!_.isEmpty(data)){
        _.forEach(data,(d)=>{
            var log = {};
            log.auto_id = d.auto_id;
            log.message = d.message;
            log.create_at = moment(d.create_at).format('YYYY-MM-DD HH:mm:ss');
            result.list.push(log);
        });
      }
      ctx.response.body = result;
  }

  //获取讨论文件
  async getFiles() {
    var ctx = this.ctx;
    var gw_id = ctx.request.body.gw_id;
    var page_index = ctx.request.body.page_index?parseInt(ctx.request.body.page_index):1;
    var page_size = ctx.request.body.page_size?parseInt(ctx.request.body.page_size):20;
    var limit = page_size;
    var offset = page_size*(page_index-1);
    var topics = await ctx.service.undertake.getTopic(gw_id,limit,offset);
    var files  = await ctx.service.undertake.getFiles(gw_id);
    
    var result = {};
    result.list = [];
    if(!_.isEmpty(topics)){
        _.forEach(topics,(t)=>{
            var topic = {};
            topic.topic_id = t.topic_id;
            if(t.topic_type == 2){
                files = _.find(files,(f)=>{
                    return f.obj_id == t.topic_id;
                });
                if(!_.isEmpty(files)){
                      topic.file_id = files.file_id;
                      topic.file_type = files.file_type;
                      topic.original_name = files.original_name;
                      topic.file_url = httpbase+files.file_path+f.file_name;
                      topic.thumb_url = httpbase+files.file_path+'thumb_'+f.file_name;
                }
            }
            result.list.push(topic);
        });
    }
    ctx.response.body = result;
  }
  //添加承办讨论人员
  async addMembers(){
      var ctx = this.ctx;
      var gw_id = ctx.request.body.gw_id;
      var user_id = ctx.request.body.user_id;
      var gw_dept_id = ctx.request.body.gw_dept_id;
      var gw_dept_name = ctx.request.body.gw_dept_name;
      var member_type = ctx.request.body.member_type;
      var is_leader = ctx.request.body.is_leader?ctx.request.body.is_leader:0;
      ctx.service.addMembers(gw_id,user_id,gw_dept_id,gw_dept_name,member_type,is_leader);
  }

  //移除/退出承办讨论
  async delUndertake(){
      var ctx = this.ctx;
      var gw_id = ctx.request.body.gw_id;
      var user_id = ctx.request.body.user_id;
      var gw_dept_id = ctx.request.body.gw_dept_id;
      ctx.service.undertake.delUndertake(gw_id,user_id,gw_dept_id);
  }
}

module.exports = UndertakeController;
