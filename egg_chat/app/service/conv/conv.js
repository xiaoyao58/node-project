'use strict';
const Service = require('egg').Service;
const _ = require('lodash');


class ConvService extends Service {
  // 创建私聊对话
  /**
     *
     * @param {string} member_id 对话成员id
     * @param {JSON} conv_msg 添加的conv信息对象
     * @param {JSON} conv_member_msg 添加的对话成员信息对象
     */
  async create_private_conv(member_id, conv_msg, conv_member_msg) {
    const { ctx, app } = this;
    const user_id = ctx.user.user_id;
    const isJson = this.ctx.service.common.isJson;
    let result = {};
    try {
      const conv = ctx.exec_sql('select conv_id from conv_member where user_id=? and conv_id in (select cm.conv_id from conv_member cm,conv c where c.conv_id=cm.conv_id and c.conv_type=1 and cm.user_id = ?);', [ member_id, user_id ]);

      if (!_.isEmpty(conv)) {

        const conv_id = conv[0].conv_id;
        result = {
          code: 0,
          conv_id,
          desc: '对话编号为：' + conv_id + '已存在。',
        };
        result = {
          conv_id,
        };
        return result;
      }
      const sql = 'insert into conv set ?;insert into conv_member set ?;';
      let params = [];

      if (isJson.is_json(conv_msg) && isJson.is_json(conv_member_msg)) {
        params = [ conv_msg, conv_member_msg ];
        const r = await ctx.exec_sql_affair(sql, params);
        if (r.error) {
          result = {
            code: 0,
            error: r.error,
          };
          return app.logger.error(r.error);
        }
        result = {
          code: 1,
          conv_id: conv_msg.conv_id,
          desc: '对话创建成功',
        };

      } else {
        return app.logger.error('service.conv.create_private: "conv_msg" and "conv_member_msg" have to be JSON');
      }

    } catch (error) {
      app.logger.error('service.conv.create_private_conv: ' + error);
    } finally {
      return result;
    }
  }
  // 获取私聊对话
  /**
     *
     * @param {JSON} conv 查询conv对话的筛选条件
     */
  async get_private_conv(conv) {
    const app = this.app;
    let result = [];
    try {
      if (_.isEmpty(conv)) {
        result = await app.mysql.select('conv', {
          columns: [ 'conv_id', 'conv_name', 'conv_desc', 'conv_type', 'create_at', 'active_at', 'avatar' ],
        });
      } else {
        result = await app.mysql.select('conv', {
          where: conv,
          columns: [ 'conv_id', 'conv_name', 'conv_desc', 'conv_type', 'create_at', 'active_at', 'avatar' ],
        });
      }
      return result;
    } catch (error) {
      app.logger.error('service.conv.conv.get_private_conv: ' + error);
    }
  }

  // 创建群聊
  /**
     *
     * @param {JSON} conv_msg 添加的conv信息对象
     * @param {arry} conv_member_msg 添加对话成员信息
     * conv_member_msg:[ [id,name,...], [id,name,...], ... ];
     */
  async create_conv(conv_msg, conv_member_msg) {
    const { ctx, app } = this;
    const isJson = this.ctx.service.common.isJson;
    let result = {};
    try {
      const sql = 'insert into conv set ?;insert into conv_member(conv_id,user_id,is_remind,is_top,last_read_at,create_user,create_at) values ?;';
      let params = [];

      if (isJson.is_json(conv_msg) && isJson.is_json(conv_member_msg)) {
        params = [ conv_msg, conv_member_msg ];
        const r = await ctx.exec_sql_affair(sql, params);
        if (r.error) {
          result = {
            code: 0,
            error: r.error,
          };
          return app.logger.error(r.error);
        }
        result = {
          code: 1,
          conv_id: conv_msg.conv_id,
          desc: '对话创建成功',
        };

      } else {
        return app.logger.error('service.conv.create_private: "conv_msg" and "conv_member_msg" have to be JSON');
      }

    } catch (error) {
      app.logger.error('service.conv.create_private_conv: ' + error);
    } finally {
      return result;
    }
  }
}
module.exports = ConvService;
