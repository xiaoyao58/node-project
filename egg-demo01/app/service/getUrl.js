'use strict';

const Service = require('egg').Service;

class GetUrlService extends Service {
  async getUrl() {
      const ctx = this.ctx;
    const result = await ctx.curl('https://wdzt5.wondersgroup.com/wrps/flow/activities?flow_id=0c3f95de84de459eb4a702b6598662ec',{
        dataType: 'json',
        timeout: 3000
    });
    return result;
  }
}

module.exports = GetUrlService;
