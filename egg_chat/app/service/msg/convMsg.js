'use strict';
const Service = require('egg').Service;
class ConvMsgService extends Service {
  /**
     *
     * @param {JSON} msg 消息列表的插入值
     */
  async add_msg(msg) {
    const ctx = this.ctx;
    const sql = 'insert into conv_msg set ?;';
    const params = [ msg ];
    let result = {};
    try {
      const r = await ctx.exec_sql(sql, params);
      if (r.error) {
        result = {
          code: 0,
          error: r.error,
        };
        return this.app.logger.error(r.error);
      }
      result = {
        code: 1,
        msg_id: msg.msg.msg_id,
        desc: '消息录入成功',
      };

    } catch (error) {
      return this.app.logger.error(error);
    } finally {
      return result;
    }
  }

  /**
     *
     * @param {JSON} msg 消息筛选条件
     */
  async get_msg(msg) {
    const { app } = this;
    let result = {};
    try {
      result = await app.mysql.select('conv_msg', {
        where: msg,
        columns: [ 'msg_id', 'conv_id', 'msg', 'msg_type', 'from_user', 'create_at' ],
        orders: [[ 'create_at', 'desc' ]],
        limit: 10,
        offset: 0,
      });
      return result;
    } catch (error) {
      app.logger.error('service.msg.convMsg.get_msg: ' + error);
    }
  }
}
module.exports = ConvMsgService;
