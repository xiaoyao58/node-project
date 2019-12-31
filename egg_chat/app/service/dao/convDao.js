'use strict';

const Service = require('egg').Service;
const { ctx, app } = this;

class ConvDaoService extends Service {
  async insert(conv) {
    const isJson = ctx.service.common.isJson;
    const mysql = app.mysql;
    if (isJson.is_json(conv)) {
      try {
        await mysql.query('insert into conv set ?', [ conv ]);
      } catch (error) {
        return app.logger.error('service.dao.ConvDaoService.insert: ' + error);
      }
    } else {
      return app.logger.error('insert对象必须是JSON对象');
    }
  }
  async delete(conv) {
    const isJson = ctx.service.common.isJson;
    const mysql = app.mysql;
    if (isJson.is_json(conv)) {
      try {
        mysql.query('delete form conv where ?', [ conv ]);
      } catch (error) {
        return app.logger.error('service.dao.ConvDaoService.delete: ' + error);
      }
    } else {
      return app.logger.error('delete对象必须是JSON对象');
    }
  }
}
module.exports = ConvDaoService;
