'use strict';
const Service = require('egg').Service;
class FilesService extends Service {
  /**
     *
     * @param {JSON} files 文件的属性
     */
  async save_files(files) {
    const { ctx, app } = this;
    const sql = 'insert into files set ?';
    const params = [ files ];
    try {
      ctx.exec_sql(sql, params);
    } catch (error) {
      app.logger.error('service.file.files.save_files: ' + error);
    }
  }

  /**
     *
     * @param {JSON} files 获取files的条件信息
     */
  async get_files(files) {
    const { app } = this;
    try {
      const result = app.mysql.select('files', {
        where: files,
        columns: [ 'file_id', 'file_type', 'file_name', 'file_path', 'original_name', 'allow_down' ],
      });
      return result;
    } catch (error) {
      app.logger.error('service.file.file.get_files: ' + error);
    }
  }
}
module.exports = FilesService;
