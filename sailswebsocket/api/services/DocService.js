module.exports = {
    save_fw: function(fw,cb){
        var fw_id = fw.fw_id;
        var biz_type_id = fw.biz_type_id;
        var gw_dept_id = fw.gw_dept_id;
        var gw_dept_name = fw.gw_dept_name;
        var draft_user_id = fw.draft_user_id;
        var draft_at = fw.draft_user_id;
        var deadline = fw.deadline;
        var fw_type_id = fw.fw_type_id;
        var doc_type_id = fw.doc_type_id;
        var doc_no = fw.doc_no;
        var doc_level = fw.doc_level;
        var print_num = fw.print_num;
        var title = fw.title;
        var is_urgent = fw.is_urgent;
        var is_public = fw.is_public;
        var is_archive = fw.is_archive;
        var is_fix = fw.is_fix;
        var fix_step = fw.fix_step;
        var complete_at = fw.complete_at;
        var remark = fw.remark;
        var create_at = fw.create_at;
        var project_id = fw.project_id;
        var res_apply_id = fw.res_apply_id;
        var is_secret = fw.is_secret;
        var is_official = fw.is_official;
        BaseService.exec_sql('insert into wdoc.doc_fw(fw_id,biz_type_id,gw_dept_id,gw_dept_name,draft_user_id,draft_at,deadline,fw_type_id,doc_type_id,doc_no,doc_level,print_num,title,is_urgent,is_public,is_archive,is_fix,fix_step,complete_at,remark,create_at,create_user,project_id,res_apply_id,is_secret,is_official) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[fw_id,biz_type_id,gw_dept_id,gw_dept_name,draft_user_id,draft_at,deadline,fw_type_id,doc_type_id,doc_no,doc_level,print_num,title,is_urgent,is_public,is_archive,is_fix,fix_step,complete_at,remark,create_at,create_user,project_id,res_apply_id,is_secret,is_official],cb);
    },
    save_fw_sign: function(fw_sign,cb){
        var sign_id = fw_sign.sign_id;
        var fw_id = fw_sign.sign_id;
        var rel_dept_id = fw_sign.rel_dept_id;
        var rel_dept_name = fw_sign.rel_dept_name;
        var sign_user_id = fw_sign.sign_user_id;
        var sign_user_name = fw_sign_user_name;
        var sort = fw_sign.sort;
        var sign_at = fw_sign.sign_at;
        var sign_type = fw_sign.sign_type;
        var create_at = fw_sign.create_at;
        BaseService.exec_sql('insert into wdoc.doc_fw_sign(sign_id,fw_id,rel_dept_id,rel_dept_name,sign_user_id,sign_user_name,sort,sign_at,sign_type,create_at) values(?,?,?,?,?,?,?,?,?,?)',[sign_id,fw_id,rel_dept_id,rel_dept_name,sign_user_id,sign_user_name,sort,sign_at,sign_type,create_at],cb);
    },
    save_fw_no:function(fw,cb){
        var fw_id = fw.fw_id;
        var rel_dept_id = fw.rel_dept_id;
        var unit_short = fw.unit_short;
        var fw_type = fw.fw_type;
        var fw_short = fw.fw_short;
        var gw_dept_id = fw.gw_dept_id;
        var gw_dept_short = fw.gw_dept_short;
        var doc_type_id = fw.doc_type_id;
        var doc_short = fw.doc_short;
        var year = fw.year;
        var doc_no = fw.doc_no;
        var create_at = fw.create_at;
        BaseService.exec_sql('insert into wdoc.doc_fw_no values(?,?,?,?,?,?,?,?,?,?,?,?)',[fw_id,rel_dept_id,unit_short,fw_type,fw_short,gw_dept_id,gw_dept_short,doc_type_id,doc_short,year,doc_no,create_at],cb);
    },
    fw_hg:function(fw,cb){
        var gw_dept_id = fw.gw_dept_id;
        var fw_id = fw.fw_id;
        var gw_dept_name = fw.gw_dept_name;
        var create_at = fw.create_at;
        var dept_type = fw.dept_type;
        BaseService.exec_sql('insert into wdoc.doc_fw_hg values(?,?,?,?,?)',[gw_dept_id,fw_id,gw_dept_name,create_at,dept_type],cb);        
    },
    fw_report: function(fw,cb){
        var report_id = fw.report_id;
        var fw_id = fw.fw_id;
        var unit_type = fw.unit_type;
        var gw_dept_id = fw.gw_dept_id;
        var gw_dept_name = fw.gw_dept_name;
        var create_at = fw.create_at;
        BaseService.exec_sql('insert into wdoc.doc_fw_report(report_id,fw_id,unit_type,gw_dept_id,gw_dept_name,create_at) values(?,?,?,?,?,?)',[report_id,fw_id,unit_type,gw_dept_id,gw_dept_name,create_at],cb);
    }
}