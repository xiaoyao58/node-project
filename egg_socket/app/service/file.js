'use strict';
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const _ = require('lodash');
const Service = require('egg').Service;

class FileService extends Service {
    async download(file_path, file_name) { //file_path:需要下载文件的路径，file_name:用户download时的文件名称
        var ctx = this.ctx;
        var stats = fs.statSync(file_path, {
            encoding: 'utf8'
        });
        var ext = path.extname(file_path, {
            encoding: 'utf8'
        });
        ctx.response.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `acttachment;filename=${file_name+ext}`,
            'Content-Length': stats.size
        });
        var stream = fs.createReadStream(file_path);
        stream.pipe(ctx.res);

        //或者
        // ctx.response.body = fs.createReadStream(file_path);
    }

    async upload(files, file_path) { //files: 上传的文件； file_path:上传文件的路径
        var ctx = this.ctx;
        //保存文件信息
        var result = {};
        result.files = [];
        _.forEach(files,file=>{
            var f = {};
            f.filed = file.filed;
            f.filename = file.filename;
            f.encoding = file.encoding;
            f.mime = file.mime;
            f.fieldname = file.fieldname;
            f.transferEncoding = file.transferEncoding;
            f.mimeType = file.mimeType;
            f.file_path = file_path+file.filepath.substring(file.filepath.lastIndexOf('/'));
            result.files.push(f);
            //写入文件
            try {
                fs.writeFileSync(file_path+file.filepath.substring(file.filepath.lastIndexOf('/')),fs.readFileSync(file.filepath));
            } catch (error) {
                if(error) this.app.logger.error(error);
            }
            //移除之前（默认）保存的文件
            rimraf(file.filepath.substring(0, file.filepath.lastIndexOf('/') - 13), (err) => {
                if (err) {
                    ctx.logger.error(err);
                }
            });
        });
        return result;
    }
}

module.exports = FileService;