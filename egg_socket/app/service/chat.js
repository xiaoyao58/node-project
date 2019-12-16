'use strict';

const Service = require('egg').Service;
const { promisify } = require('util');

class ChatService extends Service {
  async start(conv_id) {
    var { ctx, app } = this;
    var sql = 'create TEMPORARY table temp_conv_msg(select t1.* from conv_msg t1, conv t2 where t1.conv_id=? and t1.conv_id=t2.conv_id and (t2.conv_type in (1,3,4,5,6,7,8,9,10,11,12,13,14,15) or t1.create_at>=(select create_at from conv_member t3 where t1.conv_id=t3.conv_id and t3.user_id=?)) order by t1.auto_id desc limit 20);';
    var params = [conv_id, ctx.user_id];
    //rss_1
    sql += 'select * from conv where conv_id=?;';
    params.push(conv_id);
    sql += 'select * from users where user_id in (select create_user from conv where conv_id=?);';
    params.push(conv_id);
    sql += 'select * from users where user_id in (select t1.user_id from conv_member t1, conv t2 where t1.conv_id=t2.conv_id and t1.conv_id=? and t2.conv_type in (1,2)) order by job_number, name_py;';
    params.push(conv_id);
    sql += 'select * from temp_conv_msg order by auto_id;';
    sql += 'select * from users where user_id in (select from_user from temp_conv_msg where conv_id=?);';
    params.push(conv_id);
    //rss_6
    sql += 'select * from files where obj_id in (select msg_id from temp_conv_msg);';
    sql += 'select * from sysconv where sysconv_id in (select sysconv_id from conv where conv_id=? and conv_type in (5,6));';
    params.push(conv_id);
    sql += 'select * from groups where group_id=?;';
    params.push(conv_id);
    sql += 'select count(*) as unread_count from temp_conv_msg where msg_id not in (select msg_id from msg_read where user_id=?);';
    params.push(ctx.user_id);
    sql += 'insert ignore into msg_read(msg_id, user_id, create_at) select msg_id, ?, now() from temp_conv_msg;';
    params.push(ctx.user_id);
    sql += 'delete from conv_msg_unread where msg_id in (select msg_id from temp_conv_msg) and user_id=?;';
    params.push(ctx.user_id);

    sql += 'drop table temp_conv_msg;';

    var exec_sql = promisify(ctx.service.mysql.exec_sql);

    try {
      var rss = await exec_sql(sql, params);
      var rs_conv = rss[1];//对话信息
      var rs_create_user = rss[2];//创建对话的人
      var rs_member = rss[3];//对话成员
      var rs_msg = rss[4];//对话消息
      var rs_from_user = rss[5];//发送消息的人
      var rs_file = rss[6];//每条消息对应的文件
      var rs_sysconv = rss[7];//服务号对话表
      var rs_group = rss[8];//群组
      var rs_unread = rss[9];//未读消息数
      if (_.isEmpty(rs_conv)) {
        return res.ok({
          error_code: 10012,
          error_desc: '对话不存在'
        });
      }
      var conv = ctx.service.conv;
      var users = ctx.service.users;
      var conv_msg = ctx.service.conv_msg;
      var files = ctx.service.file;
      var groups = ctx.service.groups;
      var x_conv = rs_conv[0];
      var rlt_conv = conv.to_simple(x_conv);
      rlt_conv.unread_count = _.isEmpty(rs_unread) ? 0 : rs_unread[0].unread_count;
      var x_user = _.find(rs_create_user, {
        user_id: x_conv.create_user
      });
     
      if (x_user) {
        rlt_conv.create_user = users.to_simple(x_user);
      }
      rlt_conv.msgs = [];
      _.forEach(rs_msg, function (x_msg) {
        var rlt_msg = conv_msg.to_simple(x_msg);
        var x_user = _.find(rs_from_user, {
          user_id: x_msg.from_user
        });
        if (x_user) {
          rlt_msg.from_user = users.to_simple(x_user);
        }
        var x_file = _.find(rs_file, {
          obj_id: x_msg.msg_id
        });
        if (x_file) {
          rlt_msg.file = files.to_simple(x_file);
        }
        rlt_conv.msgs.push(rlt_msg);
      });
      if (!_.isEmpty(rlt_conv.msgs)) {
        rlt_conv.msg = rlt_conv.msgs[rlt_conv.msgs.length - 1];
      }
      switch (x_conv.conv_type) {
        case 1:
          {
            var x_member = rs_member[0].user_id == token.user_id ? rs_member[1] : rs_member[0];
            if (x_member) {
              rlt_conv.conv_name = x_member.name;
              rlt_conv.conv_desc = x_member.name;
              rlt_conv.avatar = users.to_avatar(x_member.avatar);
            }
            break;
          }
        case 2:
          {
            if (!x_conv.conv_name) {
              rlt_conv.conv_name = _.pluck(_.take(rs_member, 4), 'name').join(',');
            }
            if (!x_conv.conv_desc) {
              rlt_conv.conv_desc = _.pluck(rs_member, 'name').join(',');
            }
            break;
          }
        case 3:
          {
            if (!_.isEmpty(rs_group)) {
              var x_group = rs_group[0];
              rlt_conv.conv_name = x_group.group_name;
              rlt_conv.conv_desc = x_group.about;
              rlt_conv.avatar = groups.to_avatar(x_group.avatar);
              rlt_conv.is_readonly = x_group.status == 1 ? 0 : 1;
            }
            break;
          }
        case 5:
        case 6:
          {
            if (!_.isEmpty(rs_sysconv)) {
              var x_sysconv = rs_sysconv[0];
              rlt_conv.conv_name = x_sysconv.conv_name;
              rlt_conv.conv_desc = x_sysconv.conv_desc;
              rlt_conv.avatar = conv.to_avatar(x_sysconv.avatar);
            }
            break;
          }
        case 7:
          {
            rlt_conv.conv_name = '系统通知';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 8:
          {
            rlt_conv.conv_name = '任务通知';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 9:
          {
            rlt_conv.conv_name = '日程通知';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 10:
          {
            rlt_conv.conv_name = '通知公告';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 11:
          {
            rlt_conv.conv_name = '回复我的';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 12:
          {
            rlt_conv.conv_name = '提到我的';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 13:
          {
            rlt_conv.conv_name = '资源通知';
            rlt_conv.avatar = conv.to_avatar('r');
            rlt_conv.is_readonly = 1;
            break;
          }
        case 14:
          {
            rlt_conv.conv_name = '请假通知';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        case 15:
          {
            rlt_conv.conv_name = '公文通知';
            rlt_conv.avatar = conv.to_avatar(null);
            rlt_conv.is_readonly = 1;
            break;
          }
        default:
      }

    } catch (error) {
      if (error) return ctx.logger.error(error);
    }
    return rlt_conv;
  }
}

module.exports = ChatService;
