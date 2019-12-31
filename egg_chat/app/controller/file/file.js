'use strict';
const Controller = require('egg').Controller;
// const { fs } = require('mz');
const uuid = require('node-uuid');
const _ = require('lodash');
class FileController extends Controller {
  async download() {
    const ctx = this.ctx;
    const req = ctx.request.body;
    const file_path = 'D:\\nodeproject\\node-project\\egg_chat\\app\\public\\' + req.file_path;
    const file_name = 'newFile';
    try {
      await ctx.download(file_path, file_name);
    } catch (error) {
      ctx.logger.error('controller.file.file.download: ' + error);
    }

  }

  async upload() {
    const ctx = this.ctx;
    const files = ctx.request.files;
    const file_path = 'D:\\nodeproject\\node-project\\egg_chat\\app\\public';
    const req = ctx.request.body;
    const obj_id = req.obj_id ? req.obj_id : '';
    const obj_type = req.obj_type ? req.obj_type : 1;
    const allow_down = req.allow_down ? req.allow_down : 1;
    let result = {};
    try {
      result = await ctx.upload(files, file_path);

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
        const files = {
          file_id: uuid.v1(),
          obj_id,
          obj_type,
          file_type,
          file_path,
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
        ctx.service.file.files.save_files(files);
      });

      ctx.body = result;
    } catch (error) {
      ctx.logger.error('controller.file.file.upload: ' + error);
    }
  }
}
module.exports = FileController;
