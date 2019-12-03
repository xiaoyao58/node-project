'use strict';
var _ = require('lodash');
var uuid = require('uuid');
var fs = require('mz/fs');
var rimraf =require('rimraf');
const Controller = require('egg').Controller;

class UploadController extends Controller {
    async create() {
        const ctx = this.ctx;
        const files = ctx.request.files;
        var result = {};
        result.files = [];
        result.files = await ctx.service.upload.upload(files);
        ctx.body = result;
    }
    
}

module.exports = UploadController;
