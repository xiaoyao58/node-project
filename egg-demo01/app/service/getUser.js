'use strict';

const Service = require('egg').Service;

class GetUserService extends Service {
  async getUsersByDept(dept_id) {
    const users = await this.app.mysql.query('select u.user_id,u.name,u.avatar from wdzt.users u,wdzt.dept_user du where u.user_id = du.user_id and du.dept_id in (?)', dept_id);
    return users;
  }
  async getUser(user_id) {
    const user = await this.app.mysql.query('select user_id,`name`,avatar,project_id,job_number from wdzt.users where user_id = ?', user_id);
    return user;
  }
  async getDept(user_id) {
    const dept = await this.app.mysql.query('select d.dept_id,d.dept_name,d.parent_id from wdzt.dept d,wdzt.dept_user du where d.dept_id = du.dept_id and du.user_id = ?', user_id);
    return dept;
  }
  async getUserByToken(access_token) {
    try {
      const user_id = await this.app.mysql.query('select create_user from wdzt.app_token where access_token = ?', access_token);
      return user_id;
    } catch (error) {
      this.logger.error(error);
    }
    
  }
}

module.exports = GetUserService;
