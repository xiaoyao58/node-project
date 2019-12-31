'use strict';
const Service = require('egg').Service;
class Conv_memberService extends Service {
  /**
     *
     * @param {JSON} member 加入的member对象
     */
  async add_conv_member(member) {
    const { ctx, app } = this;
    const sql = 'insert into conv_member set ?';
    const params = [ member ];
    let result = {};
    try {
      await ctx.exec_sql(sql, params);
      result = {
        code: 1,
        desc: 'success',
      };
      return result;
    } catch (error) {
      app.logger.error('service.conv.conv_member.add_conv_member: ' + error);
    }

  }
}
module.exports = Conv_memberService;
