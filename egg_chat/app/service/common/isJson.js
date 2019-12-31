'use strict';
const Service = require('egg').Service;
class IsJsonService extends Service {
  // 判断是否为JSON对象
  async is_json(obj) {
    const isJson = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length;
    return isJson;
  }
}
module.exports = IsJsonService;
