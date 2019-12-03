'use strict';

const Controller = require('egg').Controller;

class GetUrlController extends Controller {
  async getUrl() {
      const {ctx} = this;
    var result = await ctx.service.getUrl.getUrl();
    ctx.body = {
        status: result.status,
        headers: result.headers,
        data: result.data
    }
  }
}

module.exports = GetUrlController;
