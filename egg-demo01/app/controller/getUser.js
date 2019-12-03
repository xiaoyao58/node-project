'use strict';
var uuid = require('uuid');
var _ = require('lodash');
const Controller = require('egg').Controller;

class GetUserController extends Controller {
  async getUsers() {
      var ctx = this.ctx;
    var service = this.ctx.service;
    var dept_id = [];
     _.forEach(ctx.dept,(d)=>{
        dept_id.push(d.dept_id);
    });
    var users = await service.getUser.getUsersByDept(dept_id);
    var result = {};
    result.users = [];
    if(users){
        _.forEach(users,(us)=>{
            var u = {};
            u.user_id = us.user_id;
            u.name = us.name;
            u.avatar = us.avatar;
            result.users.push(u);
        });
    }else{
        result.users = [];
    }
    ctx.body = result;
  }
}

module.exports = GetUserController;
