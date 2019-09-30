var moment = require('moment');

var request = require('request');
var uuid = require('uuid');
module.exports = {
    get_dept: function (req, res) {
        var user_id = req.token.user_id;
        var avatar = req.token.avatar;

        // var user_id = req.param('user_id');
        var result = {};
        result.list = [];
        BaseService.exec_sql('select dept_id from wdzt.dept_user where user_id = ?', [user_id], (err, data) => {
            if (err) {
                return res.json(err);
            }
            if (data && !_.isEmpty(data)) {
                _.forEach(data, (data) => {
                    BaseService.exec_sql('select * from wdzt.dept_admin where dept_id = ? and user_id = ?', [data.dept_id, user_id], (err, data) => {
                        if (err) {
                            return res.json(err);
                        }
                        if (data && !_.isEmpty(data)) {
                            _.forEach(data, (data) => {
                                BaseService.exec_sql('select * from wdzt.dept where dept_id = ?', [data.dept_id], (err, data) => {
                                    if (err) {
                                        return sails.log(err);
                                    }
                                    if (data && !_.isEmpty(data)) {
                                        _.forEach(data, (data) => {
                                            var result1 = {};
                                            result1 = {
                                                dept_id: data.dept_id,
                                                dept_name: data.dept_name,
                                                simple_name: data.simple_name
                                            };
                                            result.list.push(result1);
                                        });
                                        res.json(result);
                                    } else {
                                        res.json('该部门不存在');
                                    }
                                })
                            })
                        } else {
                            res.json('此人不是部门管理员');
                        }
                    })
                })
            } else {
                res.json('此人无部门');
            }
        })
    },
    dept_flow: function (req, res) {
        var user_id = req.token.user_id;
        var avatar = req.token.avatar;

        var result = {};
        BaseService.exec_sql('select dept_id from wdzt.dept_user where user_id = ?', [user_id], (err, found) => {
            if (err) {
                return sails.log(err);
            }
            if (found) {
                var dept_id = found[0].dept_id;
                BaseService.exec_sql('select flow_id,dept_id from dept_flow where dept_id = ?', [dept_id], (err, flowD) => {
                    if (err) {
                        return sails.log(err);
                    }
                    var done = _.after(flowD.length, () => {
                        res.json(result);
                    });
                    if (flowD && !_.isEmpty(flowD)) {
                        _.forEach(flowD, (f) => {
                            result.dept_id = f.dept_id;
                            result.flow_id = f.flow_id;
                            result.activity = [];
                            WapiService.get_flow_activities(f.flow_id, (err, actD) => {
                                if (err) {
                                    return sails.log(err);
                                }
                                var done_all = _.after(actD.length, () => {
                                    result.activity = result.activity.sort(CompareService.compare('list_no'));
                                    done();

                                });
                                if (actD && !_.isEmpty(actD)) {
                                    _.forEach(actD, (ac) => {
                                        var activity = {};
                                        activity.activity_id = ac.activity_id;
                                        activity.activity_name = ac.activity_name;
                                        activity.display_name = ac.display_name;
                                        activity.activity_property = ac.activity_property;
                                        activity.activity_type = ac.activity_type;
                                        activity.activity_bz = ac.activity_bz;
                                        activity.description = ac.description;
                                        activity.activity_right_description = ac.activity_right_description;
                                        activity.activity_right_user_type = ac.activity_right_user_type;
                                        activity.list_no = ac.list_no;
                                        activity.user = [];
                                        BaseService.exec_sql('select u.user_id,u.`name`,u.avatar from user_flow_right ufr,wdzt.users u where ufr.user_id = u.user_id and ufr.activity_id = ? and dept_id = ?', [ac.activity_id, dept_id], (err, data) => {
                                            if (err) {
                                                return sails.log(err);
                                            }
                                            if (data) {
                                                if (!_.isEmpty(data)) {
                                                    _.forEach(data, (data) => {
                                                        var user = {};
                                                        user.user_id = data.user_id;
                                                        user.name = data.name;
                                                        user.avatar = avatar;
                                                        if (user === undefined) {
                                                            user = null;
                                                            activity.user = null;
                                                        } else {
                                                            activity.user.push(user);
                                                        }

                                                    });
                                                }
                                            } else {
                                                res.json('该环节没有操作人员');
                                            }
                                            result.activity.push(activity);
                                            done_all();
                                        });
                                    });
                                } else {
                                    res.json('该流程无相关环节');
                                }
                                // done();
                            });
                        });
                    } else {
                        res.json('未查询到相关流程');
                    }
                });
            }

        });
    },
    year_leave: function (req, res) {
        var admin = req.token.user_id;
        // var dept_id = req.param('dpet_id');
        var get_annual = req.param('annual');
        var annual = get_annual ? get_annual : moment(new Date()).get('year');
        var name = req.param('name');

        var result = {};
        result.user_annual = [];
        BaseService.exec_sql('select dept_id from wdzt.dept_user where user_id = ?', [admin], (err, data) => {
            if (err) {
                return sails.log(err);
            }
            var dept_id = data[0].dept_id;
            BaseService.exec_sql('select u.user_id,u.job_number,u.avatar,u.`name`,u.`email`,ual.annual,ual.limited_days,ual.remaining_days,ual.valid_to from wdzt.users u,user_annual_leave ual,wdzt.dept_user du where u.user_id = ual.user_id and u.user_id = du.user_id and du.dept_id = ? and ual.annual = ?;select * from wdzt.dept where dept_id = ?', [dept_id, annual, dept_id], (err, data) => {
                if (err) {
                    return sails.log(err);
                }
                if (data && !_.isEmpty(data[0])) {
                    _.forEach(data[0], (data0) => {
                        var year_leave = {};
                        year_leave.user = {};
                        year_leave.dept = {};
                        year_leave.leave = {};
                        var dept = data[1][0];
                        year_leave.dept.dept_id = dept.dept_id;
                        year_leave.dept.dept_name = dept.dept_name;
                        year_leave.user.job_number = data0.job_number;
                        year_leave.user.user_id = data0.user_id;
                        year_leave.user.name = data0.name;
                        year_leave.user.avatar = 'http://10.2.100.197:1337/images/' + (data0.avatar ? data0.avatar : '4a06f622-028a-4323-97ef-a58326006f88.jpeg');
                        year_leave.user.email = data0.email;
                        year_leave.leave.annual = data0.annual;
                        year_leave.leave.use_days = data0.limited_days;
                        year_leave.leave.valid_to = moment(data0.valid_to).format('YYYY-MM-DD HH:mm:ss');
                        year_leave.leave.remaining_days = data0.remaining_days;
                        result.user_annual.push(year_leave);
                    });
                    if (!_.isEmpty(name)) {
                        result.user_annual = _.filter(result.user_annual, (ua) => {
                            return name.indexOf(ra.name) !== -1;
                        });
                    }
                    res.json(result);
                } else {
                    return res.json('未查询到相关信息');
                }
            })
        })

    },
    bc_select: function (req, res) {
        var update_at = moment('2018-01-01').format('YYYY-MM-DD HH:mm:ss');
        var create_at = moment('2018-01-01').format('YYYY-MM-DD HH:mm:ss');
        var result = {};
        result.bc_list = [];
        BaseService.exec_sql('select * from kq_bc', [], (err, bc_data) => {
            if (err) {
                return sails.log(err);
            }
            if (bc_data && !_.isEmpty(bc_data)) {
                _.forEach(bc_data, (bc_flag) => {
                    var bc = {};
                    bc.bc_id = bc_flag.bc_id;
                    bc.name = bc_flag.name;
                    bc.start_time = bc_flag.start_time;
                    bc.end_time = bc_flag.end_time;
                    bc.is_default = bc_flag.is_default;
                    bc.is_elastic = bc_flag.is_elastic;
                    bc.is_overtime = bc_flag.is_overtime;
                    bc.max_overtime = bc_flag.max_overtime;
                    bc.max_elastic = bc_flag.max_elastic;
                    bc.ahead_time = bc_flag.ahead_time;
                    result.bc_list.push(bc);
                });
                return res.json(result);
            } else {
                return res.json('无班次信息');
            }
        })
    },
    create_dept_pb: function (req, res) {
        var user_id = req.token.user_id;

        var pb_id = uuid.v4();

        var project_id = req.param('project_id');
        project_id = project_id ? project_id : 'D5AB602D-745E-4A08-9D90-E0F45DD33FC5';

        var type = req.param('type');
        type = type ? type : 1;

        var mon_bc = req.param('mon_bc');
        var tue_bc = req.param('tue_bc');
        var wed_bc = req.param('wed_bc');
        var thu_bc = req.param('thu_bc');
        var fri_bc = req.param('fri_bc');
        var sat_bc = req.param('sat_bc');
        var sun_bc = req.param('sum_bc');

        var mon = mom_bc ? mon_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var tue = tue_bc ? tue_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var wed = wed_bc ? wed_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var thu = thu_bc ? thu_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var fri = fri_bc ? fri_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var sat = sat_bc ? sat_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        var sun = sun_bc ? sun_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = null;

        var is_sys = req.param('is_sys');
        is_sys = is_sys ? is_sys : 0;

        var bc_id = req.param('bc_id');
   
        bc_id = bc_id ? bc_id : null;

        BaseService.exec_sql('inset into kq_pb(pb_id,project_id,`type`,`name`,mon,tue,wed,thu,fri,sat,sun,create_at,update_at,is_sys,bc_id) values(?,?,?.?,?,?,?,?,?,?,?,?,?,?,?)', [pb_id, project_id, type, name, mon, tue, wed, thu, fri, sat, sun, create_at, update_at, is_sys, bc_id], (err) => {
            if (err) {
                return sials.log(err);
            }
        })
    }
}