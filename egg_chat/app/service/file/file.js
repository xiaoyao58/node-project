'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const { fs } = require('mz');
const path = require('path');
const rimraf = require('rimraf');
class FileService extends Service {
  async download(file_path, file_name) { // file_path:需要下载文件的路径，file_name:用户download时的文件名称
    const ctx = this.ctx;
    try {
      const stats = fs.statSync(file_path, {
        encoding: 'utf8',
      });
      const ext = path.extname(file_path, {
        encoding: 'utf8',
      });
      ctx.response.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `acttachment;filename=${file_name + ext}`,
        'Content-Length': stats.size,
      });
      // var stream = fs.createReadStream(file_path);
      // stream.pipe(ctx.res);
      // 或者
      ctx.response.body = fs.createReadStream(file_path);
    } catch (error) {
      this.app.logger.error('service.file.file.download: ' + error);
    }


  }

  async upload(files, file_path) { // files: 上传的文件； file_path:上传文件的路径
    const ctx = this.ctx;
    // 保存文件信息
    const result = {};
    result.files = [];
    try {
      _.forEach(files, file => {
        const f = {};
        f.filed = file.filed;
        f.filename = file.filename;
        f.encoding = file.encoding;
        f.mime = file.mime;
        f.fieldname = file.fieldname;
        f.transferEncoding = file.transferEncoding;
        f.mimeType = file.mimeType;
        f.file_path = file_path + file.filepath.substring(file.filepath.lastIndexOf('\\'));
        // console.log(file.filepath);
        // console.log(file.filepath.substring(file.filepath.lastIndexOf('\\')));
        result.files.push(f);
        // 写入文件
        fs.writeFileSync(file_path + file.filepath.substring(file.filepath.lastIndexOf('\\')), fs.readFileSync(file.filepath));
        // 移除之前（默认）保存的文件
        rimraf(file.filepath.substring(0, file.filepath.lastIndexOf('\\') - 13), err => {
          if (err) {
            ctx.logger.error(err);
          }
        });
      });
      return result;
    } catch (error) {
      this.app.logger.error('service.file.file.upload: ' + error);
    }

  }
}
module.exports = FileService;
