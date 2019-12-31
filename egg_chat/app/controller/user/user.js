'use strict';
const Controller = require('egg').Controller;
const _ = require('lodash');

const uuid = require('node-uuid');
class UserController extends Controller {
  async create_user() {
    const ctx = this.ctx;
    const req = ctx.request.body;
    const user_id = uuid.v4();
    const name = req.name;
    const avatar = req.avatar ? req.avatar : '';
    const user = {
      user_id,
      name,
      avatar,
    };
    try {
      ctx.service.user.user.create_user(user);
      ctx.response.body = { user_id };
    } catch (error) {
      ctx.logger.error('controller.user.user.create_user: ' + error);
    }
  }

  async get_user() {
    const ctx = this.ctx;
    const req = ctx.request.body;
    const user_id = req.user_id;
    const user_arg = { user_id };
    try {
      const user = await ctx.service.user.user.get_user(user_arg);
      const file = await ctx.service.file.files.get_files({ obj_id: user_id });
      const result = {
        user_id: user[0].user_id,
        name: user[0].name,
        avatar: 'localhost:7001/' + file[0].file_path + '/' + user[0].avatar,
      };

      ctx.body = result;
    } catch (error) {
      ctx.logger.error('controller.user.user.get_user: ' + error);
    }
  }

  async set_avatar() {
    const ctx = this.ctx;
    const files = ctx.request.files;
    const file_path = 'D:\\nodeproject\\node-project\\egg_chat\\app\\public\\avatar';
    const req = ctx.request.body;
    const obj_id = req.user_id;
    const obj_type = req.obj_type ? req.obj_type : 1;
    const allow_down = req.allow_down ? req.allow_down : 1;
    let result = {};
    try {
      result = await ctx.upload(files, file_path);
      result.user_id = req.user_id;

      _.forEach(result.files, file => {
        const mime = file.mimeType.substring(0, file.mimeType.indexOf('/'));
        let file_type = 0;
        switch (mime) {
          case 'image': file_type = 1;
            break;
          case 'audio': file_type = 3;
            break;
          case 'video': file_type = 4;
            break;
          case 'text': file_type = 5;
            break;
          default: file_type = 9;
            break;
        }
        if (file_type !== 1) {
          return ctx.logger.error('controller.user.user.set_avatar: 请上传图片');
        }
        const files = {
          file_id: uuid.v1(),
          obj_id,
          obj_type,
          file_type,
          file_path: 'public/avatar',
          original_name: file.original_name,
          file_name: file.file_name,
          file_size: file.file_size,
          allow_down,
          media_length: null,
          project_id: ctx.user.project_id,
          create_user: ctx.user.user_id,
          create_at: file.create_at,
          update_at: file.update_at,
          mime_type: file.mimeType,
        };
        // 上传用户头像
        ctx.service.file.files.save_files(files);

        const user = {
          avatar: file.file_name,
        };
        const user_id = req.user_id;
        // 修改用户头像信息
        ctx.service.user.user.update_user(user, user_id);
      });

      ctx.body = result;
    } catch (error) {
      ctx.logger.error('controller.file.file.upload: ' + error);
    }
  }
}
module.exports = UserController;
