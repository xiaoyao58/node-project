'use strict';
const _ = require('lodash');
const fs = require('mz/fs');
const rimraf = require('rimraf');
const Service = require('egg').Service;

class UploadService extends Service {
    async upload(files) {
        var result = {};
        result.files= [];
        _.forEach(files, async (file) => {
            var f = {};
            f.filed = file.filed;
            f.filename = file.filename;
            f.encoding = file.encoding;
            f.mime = file.mime;
            f.fieldname = file.fieldname;
            f.transferEncoding = file.transferEncoding;
            f.mimeType = file.mimeType;
            f.filepath = 'C:\\Users\\18090\\Desktop\\getDocument\\file' + file.filepath.substring(file.filepath.lastIndexOf('\\'));
            result.files.push(f);
            fs.writeFileSync('C:\\Users\\18090\\Desktop\\getDocument\\file/' + file.filepath.substring(file.filepath.lastIndexOf('\\')), fs.readFileSync(file.filepath));
            rimraf(file.filepath.substring(0, file.filepath.lastIndexOf('\\') - 13), (err) => {
                if (err) {
                    ctx.logger.error(err);
                }
            });
        });
        return result;
    }
}

module.exports = UploadService;
