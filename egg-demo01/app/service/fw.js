const moment = require('moment');
const uuid = require('uuid');
const _ = require('lodash');
'use strict';

const Service = require('egg').Service;

class FwService extends Service {
    async update_fw(fw_id, fws) {
        var app = this.app;
        var args = [];
        var sql = "update doc_fw set ";
        if (!_isEmpty(fws)) {
            _forEach(fws, (fw) => {
                var sql = sql + fw + '=?,'
                args.push(fw);
            });
            sql = sql.substring(0, sql.lastIndexOf(','));
            sql = sql + ' where fw_id = ?;';
            args.push(fw_id);
            try {
                app.mysql.query(sql, args);
            } catch (error) {
                this.logger.error(error);
                console.log(error);
            }
        }
    }
    async update_fw_hg(fw_id, gw_dept_id, gw_dept_name) {
        var app = this.app;
        try {
            app.mysql.query('insert into doc_fw_hg(fw_id,gw_dept_id,gw_dept_name) values(?,?,?) on duplicate key update gw_dept_name = ?', [fw_id, gw_dept_id, gw_dept_name, gw_dept_name]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async delete_fw_hg() {
        var app = this.app;
        try {
            app.mysql.query('delete from doc_fw_hg');
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update_fw_sign(sign_id, fw_id, rel_dept_id, rel_dept_name, sign_user_id, sign_user_name, sort, sign_at, sign_type) {
        var app = this.app;
        try {
            app.mysql.query('update doc_fw_sign set rel_dept_id = ?,rel_dept_name = ?,sign_user_id = ?,sign_user_name = ?,sort = ?,sign_at = ?,sign_type = ? where sign_id = ? and fw_id = ?;', [rel_dept_id, rel_dept_name, sign_user_id, sign_user_name, sort, sign_at, sign_type, sign_id, fw_id]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update_fw_report(unit_type, gw_dept_id, gw_dept_name, report_id, fw_id) {
        var app = this.app;
        try {
            app.mysql.query('update doc_fw_dept set unit_type = ?,gw_dept_id = ?,gw_dept_name = ? where report_id = ?,fw_id = ?', [unit_type, gw_dept_id, gw_dept_name, report_id, fw_id]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update_activity(flow_id, activity_id, activity_type, display_name, operation_id, operation_display_name, opinion, finish_at, user_id, user_name, gw_dept_id, gw_dept_name, activity_uuid, app_uuid) {
        var app = this.app;
        try {
            app.mysql.query('update doc_activity flow_id=?,activity_id=?,activity_type=?,display_name=?,operation_id=?,operation_display_name=?,opinion=?,finish_at=?,user_id=?,user_name=?,gw_dept_id=?,gw_dept_name=? where activity_uuid = ? and app_uuid = ?', [flow_id, activity_id, activity_type, display_name, operation_id, operation_display_name, opinion, finish_at, user_id, user_name, gw_dept_id, gw_dept_name, activity_uuid, app_uuid]);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async doc(fw_id){
        var app = this.app;
        try{
          var result = app.mysql.query('select file_id,file_type,original_name,file_url,thumb_url,file_owa from doc_fw df,wapp.files fs where df.fw_id = fs.obj_id and df.fw_id = ?',fw_id);
          return result;
        }catch(error){
            this.logger.error(error);
        }
    }

    async get_all_gw_dept_id(depts){
        var all_dept = [];
        var all_gw_dept_ids  =[];
        _.forEach(depts,(d)=>{
            all_dept.push(d.dept_id);
        });
        var app = this.app;
        var parents = [];
        if(!_.isEmpty(all_dept)){
            var sql = 'select gw_dept_id,gw_dept_type from doc_dept where dept_id in ('
            _.forEach(all_dept,(ad)=>{
                sql = sql + '?,';
            });
            sql = sql.substring(0,sql.lastIndexOf(','));
            sql = sql + ')';
        }else{
            var sql =  'select gw_dept_id,gw_dept_type from doc_dept where dept_id in (?)'
        }
        
        
        var gw_dept_ids = await app.mysql.query(sql,all_dept);
        if(!_.isEmpty(gw_dept_ids)){
            _.forEach(gw_dept_ids,(gdi)=>{
                parents.push(gdi.gw_dept_id);
            });
        }
        var all = _.filter(gw_dept_ids,(g)=>{
            return g.gw_dept_type == 2;
        });
        _.forEach(all,(all)=>{
            all_gw_dept_ids.push(all.gw_dept_id);
        });
        var son_gw_dept_ids = await app.mysql.query('select gw_dept_id from doc_dept where parent_id in (?) and gw_dept_type = 2',parents);
        if(!_.isEmpty(son_gw_dept_ids)){
            _.forEach(son_gw_dept_ids,(sgdi)=>{
                all_gw_dept_ids.push(sgdi.gw_dept_id);
            });
        }
        return all_gw_dept_ids;
    }
    async fix_list(title,biz_type_id,fw_start,fw_end,doc_dept,remark,limit,offset){
        var ctx = this.ctx;
        var gw_dept_ids = await this.ctx.service.fw.get_all_gw_dept_id(ctx.dept);
        var app  =this.app;
        var result = {};
        result.list = [];
        var args = [];
        args = gw_dept_ids;
        
        if(!_.isEmpty(args)){
            var sql = 'select df.fw_id,title,ds.sign_at,gw_dept_id,gw_dept_name,remark from doc_fw df,doc_fw_sign ds where df.fw_id = ds.fw_id and gw_dept_id in (';
            _.forEach(gw_dept_ids,(gdi)=>{
                sql = sql + '?,';
            });
            sql = sql.substring(0,sql.lastIndexOf(','));
            sql = sql+")";
            if(title){
                sql = sql+' and title like ?';
                args.push('%'+title+'%');
            }
            if(biz_type_id){
                sql = sql+' and biz_type_id = ?';
                args.push(biz_type_id);
            }
            if(fw_start&&fw_end){
                sql =sql+' and create_at>=? and create_at<=?';
                args.push(fw_start,fw_end);
            }
            if(doc_dept){
                sql = sql + ' and gw_dept_name like ?';
                args.push('%'+doc_dept+'%');
            }
            if(remark){
                sql = sql + ' and remark like ?';
                args.push('%'+remark+'%');
            }

            sql = sql+' limit ? offset ?;';
            args.push(limit,offset);
            console.log(sql);
            console.log(args);
            var fixs = await app.mysql.query(sql,args);
            if(!_.isEmpty(fixs)){
                _.forEach(fixs,(f)=>{
                    var fix = {};
                    fix.fw_id = f.fw_id;
                    fix.title = f.title;
                    fix.fw_type_id = f.fw_type_id;
                    fix.sign_at = f.sign_at;
                    fix.dept = {};
                    fix.dept.gw_dept_id = f.gw_dept_id;
                    fix.dept.gw_dept_name = f.gw_dept_name;
                    fix.remark = f.remark;
                    result.list.push(fix);
                });
            }
        }
        return result;
    }
}

module.exports = FwService;
