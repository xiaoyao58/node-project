var moment = require('moment');

module.exports = {
    my_kq: function (req, res) {
        var user_id = req.param('user_id');
        var year = req.param('year');
        var month = req.param('month');

        year = year ? year : '2017';
        month = month ? month : '01';

        if (parseInt(month) === 1) {
            var start = moment((parseInt(year) - 1).toString() + '-' + '12' + '-' + '21').format('YYYY-MM-DD');
        } else {
            var start = parseInt(month) - 1 < 10 ? moment(year + '-' + '0' + (parseInt(month) - 1).toString() + '-' + '21').format('YYYY-MM-DD') : moment(year + '-' + (parseInt(month) - 1).toString() + '-' + '21').format('YYYY-MM-DD');
        }
        var end = moment(year + '-' + month + '-' + '20').format('YYYY-MM-DD');
        var result = {};
        console.log(start);
        console.log(end);
        BaseService.exec_sql('call sp_kq(?,?,?)', [user_id, start, end], (err, data) => {
            if (err) {
                return res.badRequest();
            }
            if (data && !_.isEmpty(data[0][0])) {
                var data = data[0][0];
                var late_hours = parseInt(moment.duration(data.late_min, 'minutes').as("hours"));
                var late_min = data.late_min - moment.duration(late_hours, 'hours').as('minutes');

                var early_hours = parseInt(moment.duration(data.early_min, 'minutes').as("hours"));
                var early_min = data.early_min - moment.duration(early_hours, 'hours').as('minutes');

                var overtime_hours = parseInt(moment.duration(data.overtime_min, 'minutes').as("hours"));
                var overtime_min = data.overtime_min - moment.duration(overtime_hours, 'hours').as('minutes');
                result = {
                    user_id: data.user_id,
                    normal_cs: data.normal_cs,
                    late_cs: data.normal_cs,
                    early_cs: data.early_cs,
                    late_early_cs: data.late_early_cs,
                    kg_cs: data.kg_cs,
                    Nout_cs: data.Nout_cs,
                    late_hours: late_hours,
                    late_min: late_min,
                    early_hours: early_hours,
                    early_min: early_min,
                    overtime_cs: data.overtime_cs,
                    overtime_hours: overtime_hours,
                    overtime_min: overtime_min,
                    abnormal_sb_cs: data.Abnormal_sb_cs
                }
                res.json(result);
            } else {
                res.json('未查询到相关数据')
            }
        });
    },


    kq_details: function (req, res) {
        var user_id = req.param('user_id');
        var kq_date = req.param('kq_date');

        var result = {};



        BaseService.exec_sql('call sp_kq_detail(?,?)', [user_id, kq_date], (err, data) => {
            console.log(data[2]);
            if (err) {
                return res.json(err);
            }
            if (data && !_.isEmpty(data[0])) {
                _.forEach(data[0], (data) => {
                    result = {
                        user: {
                            user_id: data.user_id,
                            user_name: data.name
                        },
                        kq_id: data.kq_id,
                        kq_date: moment(data.kq_date).format('YYYY-MM-DD'),
                        bc_id: data.bc_id,
                        bc_name: data.bc_name,
                        start_time: moment(data.start_time).format('YYYY-MM-DD HH:mm:ss'),
                        start_addr_name: data.start_addr_name,
                        start_lng: data.start_lng,
                        start_lat: data.start_lat,
                        start_desc: data.start_desc,
                        end_time: moment(data.end_time).format('YYYY-MM-DD HH:mm:ss'),
                        end_addr_name: data.end_addr_name,
                        end_lng: data.end_lnd,
                        end_lat: data.end_lat,
                        end_desc: data.end_desc,
                        repre: {
                            repre_desc: data.repre_desc,
                            repre_at: data.repre_at
                        },
                        normal_status: {
                            status: 1,
                            name: '正常',
                            hours: data.normal_result_time
                        },
                        late_status: {
                            status: 2,
                            name: '迟到',
                            hours: data.late_result_time
                        },
                        early_status: {
                            status: 3,
                            name: '早退',
                            hours: data.early_result_time
                        },
                        late_early_status: {
                            status: 4,
                            name: '迟到及早退',
                            hours: data.late_early_result_time
                        },
                        absenteeism_status: {
                            status: 5,
                            name: '旷工',
                            hours: data.kg_result_time
                        },
                        overtime_status: {
                            status: null,
                            name: '超时',
                            hours: data.overtime_result_time
                        }
                    }
                });
            } else {
                result.kq = '未查询到考勤信息'
            }
            if (data && !_.isEmpty(data[1])) {
                _.forEach(data[1], (data) => {
                    result.leave = {};

                    result.leave.leave_id = data.leave_id;
                    result.leave.title = data.title;
                    if (data.leave_type_id === '01') {
                        result.leave.leave_type_id = '01';
                        result.leave.leave_name = '年假';
                    } else if (data.leave_type_id === '02') {
                        result.leave.leave_type_id = '02';
                        result.leave.leave_name = '病假';
                    } else if (data.leave_type_id === '03') {
                        result.leave.leave_type_id = '03';
                        result.leave.leave_name = '事假';
                    } else if (data.leave_type_id === '04') {
                        result.leave.leave_type_id = '04';
                        result.leave.leave_name = '婚假';
                    } else if (data.leave_type_id === '05') {
                        result.leave.leave_type_id = '05';
                        result.leave.leave_name = '产假';
                    } else if (data.leave_type_id === '06') {
                        result.leave.leave_type_id = '06';
                        result.leave.leave_name = '陪产假';
                    } else if (data.leave_type_id === '07') {
                        result.leave.leave_type_id = '07';
                        result.leave.leave_name = '丧假';
                    } else if (data.leave_type_id === '08') {
                        result.leave.leave_type_id = '08';
                        result.leave.leave_name = '工伤假';
                    } else if (data.leave_type_id === '09') {
                        result.leave.leave_type_id = '09';
                        result.leave.leave_name = '调休';
                    } else if (data.leave_type_id === '10') {
                        result.leave.leave_type_id = '10';
                        result.leave.leave_name = '计生加';
                    } else {
                        result.leave.leave_type_id = '11';
                        result.leave.leave_name = '其他';
                    }
                    result.leave.bc_start_time = moment(data.bc_start_time).format("YYYY-MM-DD HH:mm:ss");
                    result.leave.bc_end_time = moment(data.bc_end_time).format("YYYY-MM-DD HH:mm:ss");
                    result.leave.allow = {};
                    result.leave.allow.list = [];
                });

            } else {
                result.leave = '未查询到请假信息'
            }
            if (!_.isEmpty(data[2])) {
                console.log(data[2]);
                _.forEach(data[2], (data) => {
                    var allow_leave_time = {
                        start_time: data.start_time,
                        end_time: data.end_time,
                        leave_days: data.days
                    };
                    result.leave.allow.list.push(allow_leave_time);
                });
            } else {
                result.allow_leave_time = "未查询到允许请假时段信息"
            }
            if (!_.isEmpty(data[3])) {
                result.fh = {};
                result.fh.list = [];
                _.forEach(data[3], (data) => {
                    var fh = {};
                    fh.fh_user_id = data.fh_user;
                    fh.fh_user_name = data.name;
                    fh.fh_desc = data.fh_desc;
                    fh.status = data.status;
                    fh.late_mins = data.late_mins;
                    fh.early_mins = data.early_mins;
                    fh.overtime_mins = data.overtime_mins;
                    fh.create_at = moment(data.create_at).format('YYYY-MM-DD HH:mm:ss');
                    result.fh.list.push(fh);
                });
            } else {
                result.fh = "未查询到复核信息";
            }
            return res.json(result);
        })
    },
    repre_apply: function (req, res) {
        var repre_desc = req.param('repre_desc');
        var user_id = req.param('user_id');
        var kq_date = req.param('kq_date');

        BaseService.exec_sql('select review_at from kq where user_id = ? and kq_date = ?', [user_id, kq_date], (err, data) => {
            if (err) {
                return res.json(err);
            }
            if (_.isEmpty(data)) {
                if (!_.isEmpty(repre_desc)) {
                    var repre_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    BaseService.exec_sql('insert into kq set repre repre_desc = ?,repre_at= ?', [repre_desc, repre_at]);
                } else {
                    res.json('请填写申述信息');
                }
            } else {
                res.josn('已复核');
            }
        })
    },
    //考勤复核
    kq_fh: function (req, res) {
        // var my_user_id = req.token.user_id;
        var dept_id = req.param('dept_id');
        var user_id = req.param('user_id');
        var status = req.param('status');
        var get_start = req.param('start_date');
        var get_end = req.param('end_date');
        var start_date = get_start ? get_start : moment(moment().format('YYYY-MM') + '-' + '21').format('YYYY-MM-DD');
        var end_date = get_end ? get_end : moment(moment().subtract(1, 'day')).format('YYYY-MM-DD');
        var isRepre = req.param('isRepre');//0,否；1,是
        var isReview = req.param('isReview');//0,否；1,是
        var result = {};
        result.list = [];

        if (user_id && !_.isEmpty(user_id)) {
            BaseService.exec_sql('select u.user_id,kq.kq_id,u.`name`,u.avatar,kq.kq_date,kq.bc_id,kq.bc_name,kq.bc_start_time,kq.bc_end_time,kq.start_time,kq.end_time,kq.start_lng,kq.start_lat,kq.end_lng,kq.end_lat,kq.repre_desc,kq.start_addr_name,kq.end_addr_name,kq.start_desc,kq.end_desc,kq.late_mins,kq.early_mins,kq.overtime_mins,kq.`status`,kq.review_at,kq.repre_at from kq,wdzt.users u where kq.user_id = u.user_id and kq.user_id in (?) and kq_date >= ? and kq_date<=? order by kq_date desc', [user_id.split(','), start_date, end_date], (err, data) => {
                if (err) {
                    return res.json(err);
                }
                if (data && !_.isEmpty(data)) {
                    _.forEach(data, (data) => {
                        var user_fh = {};
                        user_fh.user = {
                            user_id: data.user_id,
                            user_name: data.name,
                            user_avatar: data.avatar
                        };
                        user_fh.bc_id = data.bc_id;
                        user_fh.bc_name = data.bc_name;
                        user_fh.bc_start_time = moment(data.bc_start_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.bc_end_time = moment(data.bc_end_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.start_time = moment(data.start_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.end_time = moment(data.end_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.start_lng = data.start_lng;
                        user_fh.start_lat = data.start_lat;
                        user_fh.start_addr_name = data.start_addr_name;
                        user_fh.end_lng = data.end_lng;
                        user_fh.end_lat = data.end_lat;
                        user_fh.end_addr_name = data.end_addr_name;
                        user_fh.start_desc = data.start_desc;
                        user_fh.end_desc = data.end_desc;
                        user_fh.repre_at = moment(data.repre_at).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.repre_desc = data.repre_desc;
                        user_fh.status = data.status;
                        user_fh.review_at = moment(data.review_at).format('YYYY-MM-DD HH:mm:ss');

                        user_fh.kq_result = {};
                        if (data.status == 2) {
                            user_fh.kq_result.late_mins = data.late_mins;
                        }
                        if (data.status == 3) {
                            user_fh.kq_result.early_mins = data.early_mins;
                        }
                        if (data.status == 4) {
                            user_fh.kq_result.late_early_mins = data.late_mins + early_mins;
                        }
                        if (data.status == 5) {
                            user_fh.kq_result.kg = "旷工";
                        }
                        if (data.status == 6) {
                            user_fh.kq_result.Nout = '未签退';
                        }
                        if (data.overtime_mins > 0) {
                            user_fh.kq_result.overtime_mins = data.overtime_mins;
                        }
                        result.list.push(user_fh);
                    });
                    if (status && !_.isEmpty(status)) {
                        var status_list = _.filter(result.list, function (o) {
                            return status.indexOf(o.status) !== -1;
                        });
                        result.list = status_list;
                    }
                    if (isRepre) {
                        if (isRepre == 0) {
                            var repre_list = _.filter(result.list, function (o) {
                                return o.repre_at == 'Invalid date';
                            });
                        } else {
                            var repre_list = _.filter(result.list, function (o) {
                                return o.repre_at !== 'Invalid date';
                            });
                        }
                        result.list = repre_list;
                    }
                    if (isReview) {
                        if (isReview == 0) {
                            var review_list = _.filter(result.list, function (o) {
                                return o.review_at == 'Invalid date';
                            })
                        } else {
                            var review_list = _.filter(result.list, function (o) {
                                return o.review_at !== 'Invalid date';
                            })
                        }
                        result.list = review_list;
                    }
                    if (!_.isEmpty(result.list))
                        res.json(result);
                    else
                        res.json('未查询到相关数据');
                } else {
                    res.json('未查询到相关数据');
                }
            });
        } else {
            BaseService.exec_sql('select u.user_id,kq.kq_id,u.`name`,u.avatar,kq.kq_date,kq.bc_id,kq.bc_name,kq.bc_start_time,kq.bc_end_time,kq.start_time,kq.end_time,kq.start_lng,kq.start_lat,kq.end_lng,kq.end_lat,kq.repre_desc,kq.start_addr_name,kq.end_addr_name,kq.start_desc,kq.end_desc,kq.late_mins,kq.early_mins,kq.overtime_mins,kq.`status`,kq.review_at from kq,wdzt.users u,wdzt.dept_user du where kq.user_id = u.user_id and du.user_id = u.user_id and du.dept_id = ? and kq_date >= ? and kq_date<=? order by kq_date desc', [dept_id, start_date, end_date], (err, data) => {
                if (err) {
                    return res.json(err);
                }
                if (data && !_.isEmpty(data)) {
                    _.forEach(data, (data) => {
                        var user_fh = {};
                        user_fh.user = {
                            user_id: data.user_id,
                            user_name: data.name,
                            user_avatar: data.avatar
                        };
                        user_fh.bc_id = data.bc_id;
                        user_fh.bc_name = data.bc_name;
                        user_fh.bc_start_time = moment(data.bc_start_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.bc_end_time = moment(data.bc_end_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.start_time = moment(data.start_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.end_time = moment(data.end_time).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.start_lng = data.start_lng;
                        user_fh.start_lat = data.start_lat;
                        user_fh.start_addr_name = data.start_addr_name;
                        user_fh.end_lng = data.end_lng;
                        user_fh.end_lat = data.end_lat;
                        user_fh.end_addr_name = data.end_addr_name;
                        user_fh.start_desc = data.start_desc;
                        user_fh.end_desc = data.end_desc;
                        user_fh.repre_at = moment(data.repre_at).format('YYYY-MM-DD HH:mm:ss');
                        user_fh.repre_desc = data.repre_desc;
                        user_fh.status = data.status;
                        user_fh.review_at = moment(data.review_at).format('YYYY-MM-DD HH:mm:ss');

                        user_fh.kq_result = {};
                        if (data.status == 2) {
                            user_fh.kq_result.late_mins = data.late_mins;
                        }
                        if (data.status == 3) {
                            user_fh.kq_result.early_mins = data.early_mins;
                        }
                        if (data.status == 4) {
                            user_fh.kq_result.late_early_mins = data.late_mins + early_mins;
                        }
                        if (data.status == 5) {

                            user_fh.kq_result.kg = '旷工';
                        }
                        if (data.status == 6) {
                            user_fh.kq_result.Nout = '未签退';
                        }
                        if (data.overtime_mins > 0) {
                            user_fh.kq_result.overtime_mins = data.overtime_mins;
                        }
                        result.list.push(user_fh);
                    });
                    if (status && !_.isEmpty(status)) {
                        var status_list = _.filter(result.list, function (o) {
                            return status.indexOf(o.status) !== -1;
                        });
                        result.list = status_list;
                    }


                    if (isRepre) {
                        result.list = isRepre == 0 ? _.filter(result.list, function (o) {
                            return o.repre_at == 'Invalid date';
                        }) : _.filter(result.list, function (o) {
                            return o.repre_at !== 'Invalid date';
                        })
                    }
                    if (isReview) {
                        result.list = isReview == 0 ? _.filter(result.list, function (o) {
                            return o.review_at == 'Invalid date';
                        }) : _.filter(result.list, function (o) {
                            return o.review_at !== 'Invalid date';
                        })
                    }
                    if (!_.isEmpty(result.list))
                        res.json(result);
                    else
                        res.json('未查询到相关数据');
                } else {
                    res.json('未查询到相关数据');
                }
            })
        }

    },
    //获取部门成员
    get_dpet_user: function (req, res) {
        var dept_id = req.param('dept_id');
        var result = {};
        result.list = [];
        if (dept_id && !_.isEmpty(dept_id)) {
            BaseService.exec_sql('select u.user_id,`name` from wdzt.users u,wdzt.dept_user du where u.user_id = du.user_id and dept_id = ?', [dept_id], (err, data) => {
                if (err) {
                    console.log(err);
                    return res.json(err);
                }
                if (data && !_.isEmpty(data)) {
                    _.forEach(data, (data) => {
                        var user = {};
                        user.user_id = data.user_id;
                        user.user_name = data.name;
                        result.list.push(user);
                    });
                    res.json(result);
                } else {
                    res.json('当前部门不存在');
                }
            })
        } else {
            res.josn('请选取部门');
        }
    },
    kq_yl: function (req, res) {
        var dept_id = req.param('dept_id');
        var status = req.param('status');
        var bc_id = req.param('bc_id');
        var start = req.param('start_time');
        var start_time = start ? start : moment().get('year') + '-' + (parseInt(moment().get('month')) < 10 ? '0' + moment().get('month') : moment().get('month')) + '-' + '21';
        4
        var end = req.param('end_time');
        var repre = req.param('repre');
        var review = req.param('review');
        // BaseService.exec_sql(call )
    }
}