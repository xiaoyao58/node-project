'use strict';

// app/extend/context.js

const _ = require('lodash');
const { fs } = require('mz');
const path = require('path');
const rimraf = require('rimraf');
const { promisify } = require('util');
const moment = require('moment');

module.exports = {
  /**
   * download file
   * @param  {string} file_path   文件路径:下载的路径+文件名（包含后缀）
   * @param  {string} file_name   下载文件名
   * @return {undefined} undefined
   */
  async download(file_path, file_name) { // file_path:需要下载文件的路径，file_name:用户download时的文件名称
    try {
      const stats = fs.statSync(file_path, {
        encoding: 'utf8',
      });
      const ext = path.extname(file_path, {
        encoding: 'utf8',
      });
      this.response.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `acttachment;filename=${file_name + ext}`,
        'Content-Length': stats.size,
      });
      // var stream = fs.createReadStream(file_path);
      // stream.pipe(this.res);
      // 或者
      this.response.body = fs.createReadStream(file_path);
    } catch (error) {
      this.app.logger.error('service.file.file.download: ' + error);
    }
  },

  /**
   * upload file
   * @param {mime} files 上传的文件
   * @param {string} file_path 上传的文件路径
   */
  async upload(files, file_path) {
    // 保存文件信息
    const result = {};
    result.files = [];
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      _.forEach(files, file => {
        const f = {};
        f.filed = file.filed;
        f.original_name = file.filename;
        f.encoding = file.encoding;
        f.mime = file.mime;
        f.fieldname = file.fieldname;
        f.transferEncoding = file.transferEncoding;
        f.mimeType = file.mimeType;
        f.file_path = file_path + file.filepath.substring(file.filepath.lastIndexOf('\\'));
        f.file_name = file.filepath.substring(file.filepath.lastIndexOf('\\') + 1);
        const stats = fs.statSync(file.filepath, {
          encoding: 'utf8',
        });
        f.file_size = stats.size;
        f.create_at = now;
        f.update_at = now;
        // console.log(file.filepath);
        // console.log(file.filepath.substring(file.filepath.lastIndexOf('\\')));
        result.files.push(f);
        // 写入文件
        fs.writeFileSync(file_path + file.filepath.substring(file.filepath.lastIndexOf('\\')), fs.readFileSync(file.filepath));
        // 移除之前（默认）保存的文件
        rimraf(file.filepath.substring(0, file.filepath.lastIndexOf('\\') - 13), err => {
          if (err) {
            this.logger.error(err);
          }
        });
      });
      return result;
    } catch (error) {
      this.app.logger.error('service.file.file.upload: ' + error);
    }
  },

  /**
   *
   * @param {string} sql sql语句，多条用“;”隔开
   * @param {JSON} params 对应的sql的参数
   * {
   *    arg1:'',
   *    arg2:'',
   *    ...
   * }
   */
  async exec_sql(sql, params) {
    const exec = promisify(this.service.common.mysql.exec_sql);
    const result = await exec(sql, params);
    return result;
  },

  /**
   *
   * @param {string} sql 事务相关的sql语句，多条用“;”隔开,并且每条sql语句后面必须加“;”。
   * @param {JSON} params 对应的sql的参数
   * {
   *    arg1:'',
   *    arg2:'',
   *    ...
   * }
   */
  async exec_sql_affair(sql, params) {
    try {
      const exec = promisify(this.service.common.mysql.exec_sql);
      // 验证sql语句是否能正确执行
      await exec('begin;' + sql + 'rollback;', params);
      const data = await exec(sql, params);
      const result = {
        error: null,
        data,
      };
      return result;
    } catch (error) {
      const result = {
        error,
      };
      return result;
    }
  },

  /**
   *
   * @param {string} table 表名
   * @param {array} params 多条数据对象
   * [{arg1:'',arg2:'',...}, {arg1:'',arg2:'',...}, ...]
   */
  async exec_sql_insert_many(table, params) {
    try {
      await this.app.mysql.insert(table, params);
    } catch (error) {
      this.logger.error(error);
    }
  },
};
