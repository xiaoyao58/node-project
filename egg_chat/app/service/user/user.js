'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const uuid = require('node-uuid');

class UserService extends Service {
  async create_user(user) {
    const { ctx, app } = this;
    const user_id = uuid.v4();
    const sql = 'insert into users set ?';
    const params = [ user ];
    try {
      await ctx.exec_sql(sql, params);
      return user_id;
    } catch (error) {
      app.logger.error(error);
    }
  }

  /**
     *
     * @param {JSON} user 需要修改的user信息
     * @param {string} user_id 用户id
     */
  async update_user(user, user_id) {
    const { ctx, app } = this;
    const sql = 'update users set ? where user_id=?';
    const params = [ user, user_id ];
    try {
      await ctx.exec_sql(sql, params);
      return user_id;
    } catch (error) {
      app.logger.error('service.user.user.update_user: ' + error);
    }
  }

  /**
     *
     * @param {JSON} user user筛选条件
     */
  async get_user(user) {
    const { app } = this;
    let result = [];
    try {
      if (_.isEmpty(user)) {
        result = await this.app.mysql.select('users');
      } else {
        result = await this.app.mysql.select('users', {
          where: user,
          columns: [ 'user_id', 'name', 'avatar' ],
          orders: [[ 'create_at', 'desc' ], [ 'update_at', 'desc' ]],
          limit: 5,
          offset: 0,
        });
      }
      return result;
    } catch (error) {
      app.logger.error(error);
    }
  }

  async get_user_by_login(user_id) {
    const { app } = this;
    let result = [];
    try {
      result = await app.mysql.query('select * from users where user_id = ?', [ user_id ]);
      return result;
    } catch (error) {
      app.logger.error('service.user.user.get_user_by_login: ' + error);
    }
  }
}
module.exports = UserService;
