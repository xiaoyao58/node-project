var moment = require('moment');
var uuid = require('uuid');
module.exports = {
    create_fw: function (req, res) {
        var fw_id = uuid.v4();
        var rel_dept_id = req.param('gw_dept_id');
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var save_fw = {};
        save_fw.fw_id = fw_id;
        save_fw.biz_type_id = parseInt(req.param('biz_type'));//1：独立发文；2：联合发文（我方主办）；3：联合发文（他方主办）；4：文件签报；5：机要发文
        save_fw.gw_dept_id = gw_dept_id;
        save_fw.gw_dept_name = gw_dept_name;
        save_fw.draft_user_id = req.param('draft_user_id');
        save_fw.draft_at = moment().format('YYYY-MM-DD');
        save_fw.deadine = req.param('deadline');
        save_fw.fw_type_id = parseInt(req.param('fw_type'));//1：业务发文；2：行政发文；3：党务发文；4：团务发文
        save_fw.doc_type_id = req.param('doc_type_id');
        save_fw.doc_no = req.param('doc_no');
        save_fw.doc_level = parseInt(req.param('doc_leave'));//1：一般；2：平急；3：加急；4：特急
        save_fw.print_num = req.param('print_num');
        save_fw.title = req.param('title');
        save_fw.is_urgent = parseInt(req.param('is_urgent'));
        save_fw.is_public = parseInt(req.param('is_public'));
        save_fw.is_archive = parseInt(req.param('is_archive'));
        save_fw.is_fix = parseInt(req.param('is_fix'));
        save_fw.fix_step = parseInt(req.param('fix_step'));
        save_fw.complete_at = req.param('complete_at');
        save_fw.remark = req.param('remark');
        save_fw.create_at = create_at;
        save_fw.project_id = req.token.project_id;
        save_fw.res_apply_id = req.param('res_apply_id');
        save_fw.is_secret = parseInt(req.param('is_secret'));
        save_fw.is_official = parseInt(req.param('is_official'));
        DocService.save_fw(save_fw, (err) => {
            if (err) {
                var error = {
                    error_code: 10001,
                    error_desc: err
                }
                sails.log.error(error);
            }
        })

        var fw_sign = {};

        fw_sign.sign_id = uuid.v4();
        fw_sign.fw_id = fw_id;
        fw_sign.rel_dept_id = rel_dept_id;
        fw_sign.rel_dept_name = req.param('rel_dept_name');
        fw_sign.sign_user_id = req.param('sign_user_id');
        fw_sign.sign_user_name = req.param('sign_user_name');
        fw_sign.sort = req.param('sort');
        fw_sign.sign_at = moment(req.param('sigin_at')).format('YYYY-MM-DD');
        fw_sign.sign_type = parseInt(req.param('sign_type'));
        fw_sign.create_at = create_at;
        if (!_.isEmpty(fw_sign.sign_user_id !== null)) {
            DocService.fw_sign(fw_sign, (err) => {
                if (err) {
                    var error = {
                        error_code: 10001,
                        error_desc: err
                    }
                    sails.log.error(error);
                }
            });
        }
        var fw_report = {};
        fw_report.report_id = uuid.v4();
        fw_report.fw_id = fw_id;
        fw_report.unit_type = parseInt(req.param('unit_type'));
        fw_report.gw_dept_id = gw_dept_id;
        fw_report.gw_dept_name = gw_dept_id;
        fw_report.create_at = create_at;
        DocService.fw_report(fw_report, (err) => {
            if (err) {
                var error = {
                    error_code: 10001,
                    error_desc: err
                }
                sails.log.error(error);
            }
        });

        var fw_no = {};
        fw_no.fw_id = fw_id;
        fw_no.rel_dept_id = rel_dept_id;
        fw_no.unit_short = req.param('unit_short');
        fw_no.fw_type = req.param('fw_type');
        fw_no.fw_short = req.param('fw_short');
        fw_no.gw_dept_id = gw_dept_id;
        fw_no.gw_dept_name = gw_dept_name;
        fw_no.doc_type_id = req.param('doc_type_id');
        fw_no.doc_short = req.param('doc_short');
        fw_no.year = moment().year();
        fw_no.create_at = create_at;
        DocService.fw_no(fw_no, (err) => {
            if (err) {
                var error = {
                    error_code: 10001,
                    error_desc: err
                }
                sails.log.error(error);
            }
        });

        var fw_hg = {};
        fw_hg.gw_dept_id = gw_dept_id;
        fw_hg.fw_id = fw_id;
        fw_hg.gw_dept_name = gw_dept_name;
        fw_hg.create_at = create_at;
        fw_hg.dept_type = req.param('dept_type');
        DocService.fw_hg(fw_hg, (err) => {
            if (err) {
                var error = {
                    error_code: 10001,
                    error_desc: err
                }
                sails.log.error(error);
            }
        })
    },
    // fw_browsing: function (req, res) {
    //     var title = req.param('title');
    //     var biz_type_id = req.param('biz_type_id');
    //     var start = req.param('start_date');
    //     var end = req.param('end_date');
    //     var gw_dept_name = req.param('gw_dept_name');
    //     var remark = req.param('remark');
    //     var today = moment().format('YYYY-MM-DD');


    //     var dept_id = [];
    //     _.forEach(req.token.dept_id,(d)=>{
    //         dept_id.push(d.dept_id);
    //     })
    //     var result = {};
    //     result.fw = [];

    //     BaseService.exec_sql('select gw_dept_id from wdoc.doc_dept where dept_id in (?)',[dept_id],(err,gw_dept)=>{
    //         var gw_dept_id = [];
    //         if(err){
    //             sails.log.error(err);
    //         }
    //         if(gw_dept&&!_.isEmpty(gw_dept)){

    //             _.forEach(gw_dept,(gd)=>{
    //                 gw_dept_id.push(gd.gw_dept_id);
    //             });
    //         }
    //         BaseService.exec_sql('select fw.title,fw.biz_type_id,fws.sign_at,fw.gw_dept_name,fw.remark,dd.path_id from wdoc.doc_fw fw,wdoc.doc_fw_sign fws,wdoc.doc_dept dd where fw.fw_id = fws.fw_id and dd.gw_dept_id = fw.gw_dept_id and sign_at < ? or fw.gw_dept_id in (?) order by fws.sign_at desc', [today,gw_dept_id], (err, fw) => {
    //             if (err) {
    //                 sails.log.error(err);   
    //             }
    //             if (fw && !_.isEmpty(fw)) {
    //                 _.forEach(fw, (f) => {
    //                     var w = {};
    //                     w.title = f.title;
    //                     w.biz_type_id = f.biz_type_id;
    //                     w.sign_at = moment(f.sign_at).format('YYYY-MM-DD HH:mm:ss');
    //                     w.gw_dept_name = f.gw_dept_name;
    //                     w.remark = f.remark;
    //                     w.path_id = f.path_id;
    //                     result.fw.push(w);
    //                 });

    //                 var new_result_fw = [];
    //                 _.forEach(gw_dept_id,(gdi)=>{
    //                     var new_r_f = [];
    //                     new_r_f = _.filter(result.fw,(rf)=>{
    //                         return rf.path_id.indexOf(gdi) !== -1;
    //                     });
    //                     new_result_fw = new_result_fw.concat(new_r_f);
    //                 });
    //                 console.log(req.token.dept_id);
    //                 if (!_.isEmpty(title)) {
    //                     result.fw = _.filter(result.fw, (rf) => {
    //                         return rf.title.indexOf(title) !== -1;
    //                     });
    //                 }
    //                 if (!_.isEmpty(biz_type_id)) {
    //                     result.fw = _.filter(result.fw, (rf) => {
    //                         return rf.biz_type_id === biz_type_id;
    //                     });
    //                 }
    //                 if (!_.isEmpty(start) && !_.isEmpty(end)) {
    //                     result.fw = _.filter(result.fw, (rf) => {
    //                         return rf.sign_at >= start && rf.sign_at < end;
    //                     });
    //                 }
    //                 if (!_.isEmpty(gw_dept_name)) {
    //                     result.fw = _.filter(result.fw, (rf) => {
    //                         return rf.gw_dept_name === gw_dept_name;
    //                     });
    //                 }
    //                 if (!_.isEmpty(remark)) {
    //                     result.fw = _.filter(result.fw, (rf) => {
    //                         return rf.remark === remark;
    //                     });
    //                 }
    //             }
    //             res.json(result);
    //         });
    //     });

    // },
    select_rel_dept: function (req, res) {
        var user_id = req.token.user_id;
        var biz_type_id = parseInt(req.param('biz_type_id'));
        var rel_dept_id = req.param('rel_dept_id');
        var result = {};
        result.user = {};
        result.rel_dept = [];
        result.dept = [];
        result.biz_type = [];
        result.doc_type = [];
        var gw_dept_id = [];
        var dept_id = [];
        _.forEach(req.token.dept_id, (d) => {
            dept_id.push(d.dept_id);
        });
        BaseService.exec_sql('select gw_dept_id,gw_dept_type,parent_id from wdoc.doc_dept where dept_id in (?)', [dept_id], (err, gw_dept) => {
            if (err) {
                sails.log.error(err);
            }
            result.user = {
                user_id: req.token.user_id,
                name: req.token.name,
                avatar: req.token.avatar
            };

            if (!_.isEmpty(gw_dept)) {
                _.forEach(gw_dept, (gd) => {
                    if (gd.gw_dept_type === 1) {
                        gw_dept_id.push(gd.gw_dept_id);
                    } else {
                        gw_dept_id.push(gd.parent_id);
                    }
                });
            }
            BaseService.exec_sql('select dd.gw_dept_id,dd.gw_dept_name,ddr.rel_dept_id,ddr.rel_dept_name from wdoc.doc_dept dd,wdoc.doc_dept_rel ddr where dd.gw_dept_id = ddr.gw_dept_id and dd.gw_dept_id in (?) and is_fw_unit = 1', [gw_dept_id], (err, rel_dept) => {
                if (err) {
                    sails.log.error(err);
                }
                if (rel_dept && !_.isEmpty(rel_dept)) {
                    _.forEach(rel_dept, (rel) => {
                        var rd = {};
                        rd.gw_dept_id = rel.gw_dept_id;
                        rd.gw_dept_name = rel.gw_dept_name;
                        rd.rel_dept_id = rel.rel_dept_id;
                        rd.rel_dept_name = rel.rel_dept_name;
                        result.rel_dept.push(rd);
                    });
                }
                BaseService.exec_sql('select dd.path_id from wdoc.doc_dept dd,wdoc.doc_dept_rel ddr where dd.gw_dept_id = ddr.gw_dept_id and rel_dept_id = ?', [rel_dept_id], (err, dept) => {
                    if (err) {
                        sails.log.error(err);
                    }
                    if (dept && !_.isEmpty(dept)) {
                        var path_id = dept[0].path_id;

                        BaseService.exec_sql('select gw_dept_id,gw_dept_name,path_name,parent_id from wdoc.doc_dept where path_id like ? and gw_dept_type = 2 and dept_id in (?);select biz_type_id,biz_type_name from wdoc.dic_biz_type where biz_type_id >= ?;select doc_type_id,doc_type_name from wdoc.dic_doc_type', [path_id + "%", dept_id, biz_type_id], (err, data) => {
                            if (err) {
                                sails.log.error(err);
                            }
                            var dept2 = data[0];
                            var biz_type = data[1];
                            var doc_type = data[2];
                            if (!_.isEmpty(dept2)) {

                                _.forEach(dept2, (d2) => {
                                    var dept = {};
                                    dept.gw_dept_id = d2.gw_dept_id;
                                    dept.gw_dept_name = d2.gw_dept_name;
                                    dept.path_name = d2.path_name;
                                    dept.parent_id = d2.parent_id;
                                    result.dept.push(dept);
                                });
                            }
                            if (!_.isEmpty(biz_type)) {
                                _.forEach(biz_type, (bt) => {
                                    var biz = {};
                                    biz.biz_type_id = bt.biz_type_id;
                                    biz.biz_type_name = bt.biz_type_name;
                                    result.biz_type.push(biz);
                                });
                            }
                            if (!_.isEmpty(doc_type)) {
                                _.forEach(doc_type, (dt) => {
                                    var doc = {};
                                    doc.doc_type_id = dt.doc_type_id;
                                    doc.doc_type_name = dt.doc_type_name;
                                    result.doc_type.push(doc);
                                });
                            }
                            res.json(result);
                        });
                    }
                });
            });
        });
    },
    select_fw_type: function (req, res) {
        var result = {};
        result.fw_type = [];
        BaseService.exec_sql('select fw_type_id,fw_type_name from wdoc.dic_fw_type', [], (err, fwType) => {
            if (err) {
                return sails.log.error(err);
            }
            if (!_.isEmpty(fwType)) {
                _.forEach(fwType, (ft) => {
                    var type = {};
                    type.fw_type_id = ft.fw_type_id;
                    type.fw_type_name = ft.fw_type_name;
                    result.fw_type.push(type);
                });
            }
            res.json(result);
        });
    },
    fw_browsing: function (req, res) {
        var user_id = req.token.user_id;
        var dept_id = [];
        _.forEach(req.token.dept_id, (di) => {
            dept_id.push(di.dept_id);
        });

        var result = {};
        result.fw = [];

        var gw_dept_id = [];
        var dw = [];
        BaseService.exec_sql('select gw_dept_id,gw_dept_type from wdoc.doc_dept where dept_id in (?)', [dept_id], (err, gw_dept) => {
            if (err) {
                sails.log.error(err);
            }
            if (gw_dept && !_.isEmpty(gw_dept)) {
                _.forEach(gw_dept, (gd) => {
                    if (gd.gw_dept_type == 2)
                        gw_dept_id.push(gd.gw_dept_id);
                    if (gd.gw_dept_type == 1)
                        dw.push(gd.gw_dept_id);
                });
            }
            BaseService.exec_sql('select gw_dept_id from wdoc.doc_dept where parent_id = ?', [dw], (err, bm) => {
                if (err) {
                    sails.log.error(err);
                }
                if (bm && !_.isEmpty(bm)) {
                    _.forEach(bm, b => {
                        gw_dept_id.push(b.gw_dept_id);
                    });
                }
                BaseService.exec_sql('select distinct df.fw_id,da.title,df.biz_type_id,df.gw_dept_id,dd.dept_id,df.gw_dept_name,df.remark,df.is_public from wdoc.doc_fw df,wdoc.doc_app da,wdoc.doc_dept dd where da.app_uuid = df.fw_id and dd.gw_dept_id = df.gw_dept_id and da.`status`=1 and da.app_type = 2 and df.gw_dept_id in (?)', [gw_dept_id], (err, fw) => {
                    if (err) {
                        sails.log.error(err);
                    }
                    //获取已通过发文
                    if (fw && !_.isEmpty(fw)) {
                        var done = _.after(fw.length, () => {
                            BaseService.exec_sql('select right_code from wdoc.doc_user_auth where user_id = ? and gw_dept_id in (?)', [user_id, gw_dept_id], (err, sq) => {
                                if (err) {
                                    sails.log.error(err);
                                }
                                GetDeptLeaderService.get_dept_leader(user_id, (err, leaders) => {
                                    if (err) {
                                        sails.log.error(err);
                                        return;
                                    }
                                    if (sq && !_.isEmpty(sq)) {
                                        if (sq[0].right_code.indexOf('1')) {
                                            result.fw = result.fw;
                                        } else if (leaders && !_.isEmpty(leaders)) {
                                            var temp = [];
                                            _.forEach(leaders, (l) => {
                                                if (user_id === l.leader || user_id === l.fg_leader || user_id === l.parent.leader) {
                                                    var t = _.filter(result.fw, (rf) => {
                                                        return rf.dept_id === l.dept_id || rf.is_public == 1;
                                                    });
                                                    _.forEach(t, (t) => {
                                                        temp.push(t);
                                                    });
                                                }
                                            });
                                            result.fw = temp;
                                        } else {
                                            result.fw = _.filter(result.fw, (rf) => {
                                                return rf.is_public == 1;
                                            });
                                        }
                                    } else {
                                        if (leaders && !_.isEmpty(leaders)) {
                                            var temp = [];
                                            _.forEach(leaders, (l) => {
                                                if (user_id === l.leader || user_id === l.fg_leader || user_id === l.parent.leader) {
                                                    var t = _.filter(result.fw, (rf) => {
                                                        return rf.dept_id === l.dept_id || rf.is_public == 1;
                                                    });
                                                    _.forEach(t, (t) => {
                                                        temp.push(t);
                                                    });
                                                    result.fw = temp;
                                                } else {
                                                    result.fw = _.filter(result.fw, (rf) => {
                                                        return rf.is_public == 1;
                                                    });
                                                }
                                            });
                                        } else {
                                            result.fw = _.filter(result.fw, (rf) => {
                                                return rf.is_public == 1;
                                            });
                                        }
                                    }
                                    result.fw = result.fw.sort(function (a, b) {
                                        if (a.sign_at > b.sign_at) {
                                            return -1;
                                        } else if (a.sign_at < b.sign_at) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    });
                                    res.json(result);
                                });
                            });
                        });
                        _.forEach(fw, (f) => {
                            BaseService.exec_sql('select sign_at from wdoc.doc_fw_sign where fw_id = ? order by sign_at desc limit 1 offset 0', [f.fw_id], (err, sign) => {
                                if (err) {
                                    sails.log.error(err);
                                }
                                var fawen = {};
                                fawen.title = f.title;
                                fawen.biz_type_id = f.biz_type_id;
                                fawen.sign_at = sign[0].sign_at ? moment(sign[0].sign_at).format('YYYY-MM-DD') : "";
                                fawen.dept = {};
                                fawen.dept.gw_dept_id = f.gw_dept_id;
                                fawen.dept.gw_dept_name = f.gw_dept_name;
                                fawen.dept_id = f.dept_id;
                                fawen.remark = f.remark;
                                fawen.is_public = f.is_public;
                                result.fw.push(fawen);
                                done();
                            });
                        });
                    }
                });
            });
        });
    },
    sw_borsing: function (req, res) {
        var result = {};
        result.sw = [];
        var user_id = req.token.user_id;
        var dept_id = [];
        _.forEach(req.token.dept_id, (di) => {
            dept_id.push(di.dept_id);
        });
        var sql_unit = 'select gw_dept_id from wdoc.doc_dept where gw_dept_type = 1 and dept_id in(?)';
        var param_unit = [dept_id];

        BaseService.exec_sql(sql_unit, param_unit, (err, unit) => {
            var sql_sw = 'select sw_id,title,biz_type_id,sw_at,doc_unit,remark,is_public,gw_dept_id,host_dept_id from wdoc.doc_sw where gw_dept_id in(?) order by sw_at desc';
            var param_sw = [];
            if (err) {
                sails.log.error(err);
                return;
            }
            if (unit && !_.isEmpty(unit)) {
                _.forEach(unit, (u) => {
                    param_sw.push(u.gw_dept_id);
                });
            }
            BaseService.exec_sql('select gw_dept_id from wdoc.doc_dept where parent_id in (?)', [param_sw], (err, gdi) => {
                if (err) {
                    sails.log.error(err);
                    return;
                }
                if (gdi && !_.isEmpty(gdi)) {
                    param_sw.pop();
                    _.forEach(gdi, (g) => {
                        param_sw.push(g.gw_dept_id);
                    });
                }
                BaseService.exec_sql(sql_sw, [param_sw], (err, sw) => {
                    if (err) {
                        sails.log.error(err);
                        return;
                    }
                    if (sw && !_.isEmpty(sw)) {
                        var done = _.after(sw.length, () => {
                            BaseService.exec_sql('select right_code from wdoc.doc_user_auth where user_id = ? and gw_dept_id in (?)', [user_id, param_sw], (err, sq) => {
                                if (err) {
                                    sails.log.error(err);
                                    return;
                                }
                                GetDeptLeaderService.get_dept_leader(user_id, (err, leaders) => {
                                    if (err) {
                                        sails.log.error(err);
                                    }
                                    if (sq && !_.isEmpty(sq)) {
                                        if (sq.indexOf('1') == -1) {
                                            result.sw = _.filter(result.sw, (rs) => {
                                                return rs.is_public == 1;
                                            });
                                        } else if (leaders && !_.isEmpty(leaders)) {
                                            var temp = [];
                                            _.forEach(leaders, (l) => {
                                                if (user_id === l.leader || user_id === l.fg_leader || user_id === l.parent.leader) {
                                                    BaserService.exec_sql('select gw_dept_id from wdoc.doc_dept where dept_id = ?', [l.dept_id], (err, gd) => {
                                                        if (err) {
                                                            sails.log.error(err);
                                                            return;
                                                        }
                                                        if (gd && !_.isEmpty(gd)) {
                                                            _.forEach(gd, (g) => {
                                                                var t = _.filter(result.rs, (rs) => {
                                                                    return g.gw_dept_id === rs.sw_gw_dept_id || g.gw_dept_id === rs.host_dept_id || g.gw_dept_id === rs.xb_gw_dept_id || rs.is_public == 1;
                                                                });
                                                                _.forEach(t, (t) => {
                                                                    temp.push(t);
                                                                });
                                                            });
                                                        }
                                                    });
                                                    result.sw = temp;
                                                }
                                            });

                                        } else {
                                            result.sw = _.filter(result.sw, (rs) => {
                                                return rs.is_public == 1;
                                            });
                                        }
                                    } else {
                                        if (leaders && !_.isEmpty(leaders)) {
                                            var temp = [];
                                            _.forEach(leaders, (l) => {
                                                if (user_id === l.leader || user_id === l.fg_leader || user_id === l.parent.leader) {
                                                    BaserService.exec_sql('select gw_dept_id from wdoc.doc_dept where dept_id = ?', [l.dept_id], (err, gd) => {
                                                        if (err) {
                                                            sails.log.error(err);
                                                            return;
                                                        }
                                                        if (gd && !_.isEmpty(gd)) {
                                                            _.forEach(gd, (g) => {
                                                                var t = _.filter(result.rs, (rs) => {
                                                                    return g.gw_dept_id === rs.sw_gw_dept_id || g.gw_dept_id === rs.host_dept_id || String(rs.xb_gw_dept_id).indexOf(g.gw_dept_id) !== -1 || rs.is_public == 1;
                                                                });
                                                                _.forEach(t, (t) => {
                                                                    temp.push(t);
                                                                });
                                                            });
                                                        }
                                                    });
                                                    result.sw = temp;
                                                } else {
                                                    result.sw = _.filter(result.sw, (rs) => {
                                                        return rs.is_public == 1;
                                                    });
                                                }
                                            });
                                        } else {
                                            result.sw = _.filter(result.sw, (rs) => {
                                                return rs.is_public == 1;
                                            });
                                        }
                                    }
                                    res.json(result);
                                });
                            });
                        });
                        _.forEach(sw, (s) => {
                            var w = {};
                            w.title = s.title;
                            w.biz_type_id = s.biz_type_id;
                            w.sw_at = moment(s.sw_at).format('YYYY-MM-DD');
                            w.doc_unit = s.doc_unit;
                            w.remark = s.remark;
                            w.is_public = s.is_public;
                            w.sw_gw_dept_id = s.gw_dept_id;
                            w.host_dept_id = s.host_dept_id;
                            w.xb_gw_dept_id = [];
                            BaseService.exec_sql('select gw_dept_id from wdoc.doc_sw_dept where sw_id = ?', [s.sw_id], (err, dsd) => {
                                if (err) {
                                    sails.log.error(err);
                                    return;
                                }
                                if (dsd && !_.isEmpty(dsd)) {
                                    _.forEach(dsd, (d) => {
                                        w.xb_gw_dept_id.push(d.gw_dept_id);
                                    });
                                }
                                result.sw.push(w);
                                done();
                            });
                        });
                    }
                });
            });
        });
    },
    get_leader: function (req, res) {
        var user_id = req.token.user_id;
        var result = {};
        result.leaders = [];
        GetDeptLeaderService.get_dept_leader(user_id, (err, leaders) => {
            if (err) {
                sails.log.error(err);
                return;
            }
            if (leaders && !_.isEmpty(leaders)) {
                result.leaders = leaders;
                res.json(result);
            }
        });
    }
}