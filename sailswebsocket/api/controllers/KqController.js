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
        var dept_id = req.param('dept_id');//必选
        var user_id = req.param('user_id');//可选 多个值用“,”分开
        var status = req.param('status');//可选   多个值用“,”分开
        var get_start = req.param('start_date');//可选
        var get_end = req.param('end_date');//可选
        var start_date = get_start ? get_start : moment(moment().format('YYYY-MM') + '-' + '21').format('YYYY-MM-DD');
        var end_date = get_end ? get_end : moment(moment().subtract(1, 'day')).format('YYYY-MM-DD');
        var isRepre = req.param('isRepre');//0,否；1,是     可选
        var isReview = req.param('isReview');//0,否；1,是   可选
        var isLeave = req.param('isLeave');//0,否；1,是     可选
        var isAddrEx = req.param('isAddrEx');//0,否；1,是     可选
        var isOvertime = req.param('isOvertime')//0,否；1,是     可选
        var isDevice = req.param('isDevice')//0,否；1,是     可选
        var result = {};
        result.list = [];
        BaseService.exec_sql('select u.user_id,kq.kq_id,u.`name`,u.avatar,kq.kq_date,kq.bc_id,kq.bc_name,kq.bc_start_time,kq.bc_end_time,kq.start_time,kq.end_time,kq.start_lng,kq.start_lat,kq.end_lng,kq.end_lat,kq.repre_at,kq.repre_desc,kq.start_addr_name,kq.end_addr_name,kq.start_desc,kq.end_desc,kq.late_mins,kq.early_mins,kq.overtime_mins,kq.`status`,kq.review_at from kq,wdzt.users u,wdzt.dept_user du where kq.user_id = u.user_id and du.user_id = u.user_id and du.dept_id = ? and kq_date >= ? and kq_date<=? order by kq_date desc;select * from kq_leave_relation;select * from kq_device', [dept_id, start_date, end_date], (err, data) => {
            if (err) {
                return res.json(err);
            }
            var leave_data = data[1];
            var device_data = data[2];
            if (data && !_.isEmpty(data[0])) {
                _.forEach(data[0], (data) => {
                    var user_fh = {};
                    user_fh.user = {
                        user_id: data.user_id,
                        user_name: data.name,
                        user_avatar: data.avatar
                    };
                    user_fh.kq_id = data.kq_id;
                    user_fh.kq_date = moment(data.kq_date).format('YYYY-MM-DD');
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

                    user_fh.leave = {};

                    if (!_.isEmpty(leave_data)) {
                        var leave_list = _.filter(leave_data, (o) => {
                            return o.kq_id === data.kq_id;
                        });
                        if (_.isEmpty(leave_list)) {
                            user_fh.leave.leave_id = null;
                            user_fh.leave.leave_type_id = null;
                            user_fh.leave.leave_type_name = null;
                            user_fh.leave.leave_days = null;
                        } else {
                            _.forEach(leave_list, function (ll) {
                                user_fh.leave.leave_id = ll.leave_id;
                                user_fh.leave.leave_type_id = ll.leave_type_id;
                                user_fh.leave.leave_type_name = ll.leave_type_name;
                                user_fh.leave.leave_days = ll.leave_days;
                            });
                        }
                    } else {
                        user_fh.leave.leave_id = null;
                        user_fh.leave.leave_type_id = null;
                        user_fh.leave.leave_type_name = null;
                        user_fh.leave.leave_days = null;
                    }
                    user_fh.device = {};
                    if (!_.isEmpty(device_data)) {
                        var device_list = _.filter(device_data, (o) => {
                            return o.kq_id === data.kq_id;
                        });
                        if (!_.isEmpty(device_list)) {
                            var device_find1 = _.find(device_list, (f) => {
                                return f.kq_type == 1;
                            });
                            var device_find2 = _.find(device_list, (f) => {
                                return f.kq_type == 2;
                            })
                            if (device_find1.device_id === device_find2.device_id) {
                                user_fh.device.status = 0;
                                user_fh.device.name = "设备正常";
                            } else {
                                user_fh.device.status = 1;
                                user_fh.device.name = "设备异常";
                            }
                        } else {
                            user_fh.device.status = 1;
                            user_fh.device.name = "设备异常";
                        }

                    }
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
                    if (data.start_addr_name == null) {
                        user_fh.kq_result.addr_ex = '位置异常'
                    }
                    if (user_fh.device.status == 1) {
                        user_fh.kq_result.device_ex = '设备异常'
                    }
                    if (data.overtime_mins > 0) {
                        user_fh.kq_result.overtime_mins = data.overtime_mins;
                    }
                    result.list.push(user_fh);
                });
                if (!_.isEmpty(user_id)) {
                    var user_list = _.filter(result.list, (o) => {
                        return user_id.indexOf(o.user.user_id) !== -1;
                    })
                    result.list = user_list;
                }
                if (status && !_.isEmpty(status)) {
                    var status_list = _.filter(result.list, function (o) {
                        return status.indexOf(o.status) !== -1;
                    });
                    result.list = status_list;
                }
                if (isRepre) {
                    result.list = (isRepre == 0) ? (_.filter(result.list, function (o) {
                        return o.repre_at == 'Invalid date';
                    })) : (_.filter(result.list, function (o) {
                        return o.repre_at !== 'Invalid date';
                    }))
                }
                if (isReview) {
                    result.list = isReview == 0 ? _.filter(result.list, function (o) {
                        return o.review_at == 'Invalid date';
                    }) : _.filter(result.list, function (o) {
                        return o.review_at !== 'Invalid date';
                    })
                }

                if (isLeave) {
                    result.list = isLeave == 0 ? _.filter(result.list, function (o) {
                        return o.leave.leave_id === null;
                    }) : _.filter(result.list, function (o) {
                        return o.leave.leave_id !== null;
                    });
                }

                if (isAddrEx) {
                    result.list = isAddrEx == 1 ? _.filter(result.list, function (o) {
                        return o.start_addr_name === null;
                    }) : _.filter(result.list, function (o) {
                        return o.start_addr_name !== null;
                    });
                }

                if (isOvertime) {
                    result.list = isOvertime == 1 ? _.filter(result.list, function (o) {
                        return o.overtime_mins > 0;
                    }) : _.filter(result.list, function (o) {
                        return o.overtime_mins == 0 || o.overtime_mins == null;
                    });
                }

                if (isDevice) {
                    result.list = isDevice == 1 ? _.filter(result.list, function (o) {
                        return o.device.status == 1;
                    }) : _.filter(result.list, function (o) {
                        return o.device.status == 0;
                    });
                }
                if (!_.isEmpty(result.list))
                    res.json(result);
                else
                    res.json('未查询到相关数据');
            } else {
                res.json('未查询到相关数据');
            }
        });

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
        var dept_id = req.param('dept_id');//必选
        var user_id = req.param('user_id');//可选 多个值用“,”分开
        var status = req.param('status');//可选   多个值用“,”分开
        var get_start = req.param('start_date');//可选
        var get_end = req.param('end_date');//可选
        var start_date = get_start ? get_start : moment(moment().format('YYYY-MM') + '-' + '21').format('YYYY-MM-DD');
        var end_date = get_end ? get_end : moment(moment().subtract(1, 'day')).format('YYYY-MM-DD');
        var isRepre = req.param('isRepre');//0,否；1,是     可选
        var isReview = req.param('isReview');//0,否；1,是   可选
        var isLeave = req.param('isLeave');//0,否；1,是     可选
        var isAddrEx = req.param('isAddrEx');//0,否；1,是     可选
        var isOvertime = req.param('isOvertime')//0,否；1,是     可选
        var isDevice = req.param('isDevice')//0,否；1,是     可选
        var bc_id = req.param('bc_id');
        var result = {};
        result.list = [];
        BaseService.exec_sql('select u.user_id,kq.kq_id,u.`name`,u.avatar,kq.kq_date,kq.bc_id,kq.bc_name,kq.bc_start_time,kq.bc_end_time,kq.start_time,kq.end_time,kq.start_lng,kq.start_lat,kq.end_lng,kq.end_lat,kq.repre_at,kq.repre_desc,kq.start_addr_name,kq.end_addr_name,kq.start_desc,kq.end_desc,kq.late_mins,kq.early_mins,kq.overtime_mins,kq.`status`,kq.review_at from kq,wdzt.users u,wdzt.dept_user du where kq.user_id = u.user_id and du.user_id = u.user_id and du.dept_id = ? and kq_date >= ? and kq_date<=? order by kq_date desc;select * from kq_leave_relation;select * from kq_device', [dept_id, start_date, end_date], (err, data) => {
            if (err) {
                return res.json(err);
            }
            if (data && !_.isEmpty(data[0])) {
                _.forEach(data[0], (data0) => {
                    var user_yl = {};
                    user_yl.user = {
                        user_id: data0.user_id,
                        user_name: data0.name,
                        user_avatar: data0.avatar
                    };
                    user_yl.kq_id = data0.kq_id;
                    user_yl.kq_date = moment(data0.kq_date).format('YYYY-MM-DD');
                    user_yl.bc_id = data0.bc_id;
                    user_yl.bc_name = data0.bc_name;
                    user_yl.bc_start_time = moment(data0.bc_start_time).format('YYYY-MM-DD HH:mm:ss');
                    user_yl.bc_end_time = moment(data0.bc_end_time).format('YYYY-MM-DD HH:mm:ss');
                    user_yl.start_time = moment(data0.start_time).format('YYYY-MM-DD HH:mm:ss');
                    user_yl.end_time = moment(data0.end_time).format('YYYY-MM-DD HH:mm:ss');
                    user_yl.start_lng = data0.start_lng;
                    user_yl.start_lat = data0.start_lat;
                    user_yl.start_addr_name = data0.start_addr_name;
                    user_yl.end_lng = data0.end_lng;
                    user_yl.end_lat = data0.end_lat;
                    user_yl.end_addr_name = data0.end_addr_name;
                    user_yl.start_desc = data0.start_desc;
                    user_yl.end_desc = data0.end_desc;
                    user_yl.repre_at = moment(data0.repre_at).format('YYYY-MM-DD HH:mm:ss');
                    user_yl.repre_desc = data0.repre_desc;
                    user_yl.status = data0.status;
                    user_yl.review_at = moment(data0.review_at).format('YYYY-MM-DD HH:mm:ss');

                    user_yl.leave = {};
                    if (!_.isEmpty(data[1])) {
                        var leave_list = _.filter(data[1], (o) => {
                            return o.kq_id === data0.kq_id;
                        });
                        if (_.isEmpty(leave_list)) {
                            user_yl.leave.leave_id = null;
                            user_yl.leave.leave_type_id = null;
                            user_yl.leave.leave_type_name = null;
                            user_yl.leave.leave_days = null;
                        } else {
                            _.forEach(leave_list, function (ll) {
                                user_yl.leave.leave_id = ll.leave_id;
                                user_yl.leave.leave_type_id = ll.leave_type_id;
                                user_yl.leave.leave_type_name = ll.leave_type_name;
                                user_yl.leave.leave_days = ll.leave_days;
                            });
                        }
                    } else {
                        user_yl.leave.leave_id = null;
                        user_yl.leave.leave_type_id = null;
                        user_yl.leave.leave_type_name = null;
                        user_yl.leave.leave_days = null;
                    }
                    user_yl.device = {};
                    if (!_.isEmpty(data[2])) {
                        var device_list = _.filter(data[2], (o) => {
                            return o.kq_id == data0.kq_id;
                        });
                        if (!_.isEmpty(device_list)) {
                            var device_find1 = _.find(device_list, (f) => {
                                return f.kq_type == 1;
                            });
                            var device_find2 = _.find(device_list, (f) => {
                                return f.kq_type == 2;
                            });

                            if (device_find1.device_id === device_find2.device_id) {
                                user_yl.device.status = 0;
                                user_yl.device.name = "设备正常";
                            } else {
                                user_yl.device.status = 1;
                                user_yl.device.name = "设备异常";
                            }
                        } else {
                            user_yl.device.status = 1;
                            user_yl.device.name = "设备异常";
                        }

                    }
                    user_yl.kq_result = {};
                    if (data0.status == 2) {
                        user_yl.kq_result.late_mins = data0.late_mins;
                    }
                    if (data0.status == 3) {
                        user_yl.kq_result.early_mins = data0.early_mins;
                    }
                    if (data0.status == 4) {
                        user_yl.kq_result.late_early_mins = data0.late_mins + early_mins;
                    }
                    if (data0.status == 5) {
                        user_yl.kq_result.kg = '旷工';
                    }
                    if (data0.status == 6) {
                        user_yl.kq_result.Nout = '未签退';
                    }
                    if (data0.start_addr_name == null) {
                        user_yl.kq_result.addr_ex = '位置异常';
                    }
                    if (user_yl.device.status == 1) {
                        user_yl.kq_result.device_ex = '设备异常';
                    }
                    if (data0.overtime_mins > 0) {
                        user_yl.kq_result.overtime_mins = data0.overtime_mins;
                    }

                    result.list.push(user_yl);
                });

                if (!_.isEmpty(user_id)) {
                    var user_list = _.filter(result.list, (o) => {
                        return user_id.indexOf(o.user.user_id) !== -1;
                    })
                    result.list = user_list;
                }

                if (status && !_.isEmpty(status)) {
                    var status_list = _.filter(result.list, function (o) {
                        return status.indexOf(o.status) !== -1;
                    });
                    result.list = status_list;
                }
                if (isRepre) {
                    result.list = (isRepre == 0) ? (_.filter(result.list, function (o) {
                        return o.repre_at == 'Invalid date';
                    })) : (_.filter(result.list, function (o) {
                        return o.repre_at !== 'Invalid date';
                    }))
                }
                if (isReview) {
                    result.list = isReview == 0 ? _.filter(result.list, function (o) {
                        return o.review_at == 'Invalid date';
                    }) : _.filter(result.list, function (o) {
                        return o.review_at !== 'Invalid date';
                    })
                }

                if (isLeave) {
                    result.list = isLeave == 0 ? _.filter(result.list, function (o) {
                        return o.leave.leave_id === null;
                    }) : _.filter(result.list, function (o) {
                        return o.leave.leave_id !== null;
                    });
                }

                if (isAddrEx) {
                    result.list = isAddrEx == 1 ? _.filter(result.list, function (o) {
                        return o.start_addr_name === null;
                    }) : _.filter(result.list, function (o) {
                        return o.start_addr_name !== null;
                    });
                }

                if (isOvertime) {
                    result.list = isOvertime == 1 ? _.filter(result.list, function (o) {
                        return o.overtime_mins > 0;
                    }) : _.filter(result.list, function (o) {
                        return o.overtime_mins == 0 || o.overtime_mins == null;
                    });
                }
                if (isDevice) {
                    result.list = isDevice == 1 ? _.filter(result.list, function (o) {
                        return o.device.status == 1;
                    }) : _.filter(result.list, function (o) {
                        return o.device.status == 0;
                    });
                }
                if (bc_id) {
                    var bc_list = _.filter(result.list, (o) => {
                        return bc_id.indexOf(o.bc_id) !== -1;
                    });
                    result.list = bc_list;
                }
                if (!_.isEmpty(result.list))
                    res.json(result);
                else
                    res.json('未查询到相关数据');
            } else {
                res.json('未查询到相关数据');
            }
        });
    },
    kq_statistic: function (req, res) {
        var dept_id = req.param('dept_id');
        var get_start = req.param('start_date');
        var get_end = req.param('end_date');
        var start_date = get_start ? get_start : moment(moment().format('YYYY-MM') + '-' + '21').format('YYYY-MM-DD');
        var end_date = get_end ? get_end : moment(moment().subtract(1, 'day')).format('YYYY-MM-DD');
        var user_id = req.param('user_id');
        var device_cs = 0;
        var result = {};
        result.list = [];
        BaseService.exec_sql('call sp_kq_statistic(?,?,?);select * from kq_device', [dept_id, start_date, end_date], (err, data) => {
            if (err) {
                return res.json(err);
            }
            if (data && !_.isEmpty(data[0])) {
                _.forEach(data[0], function (data0) {
                    var kq_statis = {};
                    kq_statis.user = {};
                    kq_statis.user.user_id = data0.user_id;
                    kq_statis.user.user_name = data0.name;
                    kq_statis.user.avatar = data0.avatar;
                    kq_statis.bc = {};
                    kq_statis.bc.bc_id = data0.bc_id;
                    kq_statis.bc.bc_name = data0.bc_name;
                    kq_statis.workdays = data0.workdays;
                    kq_statis.not_review = data0.not_review;
                    kq_statis.not_review_repre = data0.not_review_repre;
                    kq_statis.Nout = data0.Nout;
                    kq_statis.overtime_cs = data0.overtime_cs;
                    kq_statis.overtime_time = data0.overtime_time;
                    kq_statis.late_early_cs = data0.late_early_cs;
                    kq_statis.late_early_time = data0.late_early_time;
                    kq_statis.kg = data0.kg;
                    kq_statis.leave = {
                        all_count: data0.all_count,
                        nj_count: data0.nj_count,
                        bj_count: data0.bj_count,
                        shij_count: data0.shij_count,
                        hj_count: data0.hj_count,
                        cj_count: data0.cj_count,
                        pcj_count: data0.pcj_count,
                        sj_count: data0.sj_count,
                        gsj_count: data0.gsj_count,
                        tx_count: data0.tx_count,
                        jsj_count: data0.jsj_count,
                        qtj_count: data0.qtj_count
                    };
                    var device_list = _.filter(data[1], (f) => {
                        return ((f.kq_id === data0.kq_id) && (data0.review_at === null));
                    });
                    if (!_.isEmpty(device_list)) {

                        for (var date = satrt_date; date <= end_date; moment(date).add('day')) {
                            var device_day = _.filter(device_list, (dl) => {
                                return dl.create_at == date;
                            });
                            var device_find1 = _.find(device_day, (f) => {
                                return f.kq_type == 1;
                            });
                            var device_find2 = _.find(device_day, (f) => {
                                return f.kq_type == 2;
                            });
                            if (device_find1.device_id !== device_find2.device_id) {
                                device_ex_cs += 1;
                            }
                        }
                    }

                    kq_statis.device_cs = device_cs;
                    result.list.push(kq_statis);
                });
                if (user_id) {
                    if (!_.isEmpty(user_id)) {
                        result.list = _.filter(result.list, (o) => {
                            return user_id.indexOf(o.user.user_id) !== -1;
                        });
                    }
                }
                res.json(result);
            } else {
                res.json('未查询到相关数据');
            }
        });
    },
    kq_statis_detail: function (req, res) {
        var user_id = req.param('user_id');
        var get_start = req.param('start_date');
        var get_end = req.param('end_date');
        var start_date = get_start ? get_start : moment(moment().format('YYYY-MM') + '-' + '21').format('YYYY-MM-DD');
        var end_date = get_end ? get_end : moment(moment().subtract(1, 'day')).format('YYYY-MM-DD');
        var result = {};
        result.list = [];
        BaseService.exec_sql('call sp_kq(?,?,?)', [user_id, start_date, end_date], (err, data) => {

            if (err) {
                return res.json(err);
            }
            if (data && !_.isEmpty(data[1])) {
                _.forEach(data[1], (data1) => {
                    var kq_detail = {};
                    kq_detail.user = {
                        user_id: data1.user_id,
                        user_name: data1.name,
                        avatar: data1.avatar
                    };


                    kq_detail.statis = {
                        late_cs: data1.late_cs,
                        early_cs: data1.early_cs,
                        kg_cs: data1.kg_cs,
                        Nout_cs: data1.Nout_cs,
                        addr_ex_cs: data1.addr_ex_cs,
                        late_min: data1.late_min,
                        early_min: data1.early_min,
                        overtime_cs: data1.overtime_cs,
                        overtime_min: data1.overtime_min,
                        leave_cs: data1.leave_cs,
                        leave_days_statis: data1.leave_days_statis
                    };

                    kq_detail.kq={};
                    kq_detail.kq.list = [];
                    if (!_.isEmpty(data[2])) {
                        _.forEach(data[2], (data2) => {
                            var kq = {};
                            
                            kq.detail = {
                                kq_id: data2.kq_id,
                                kq_date: moment(data2.kq_date).format('YYYY-MM-DD'),
                                start_time: data2.start_time,
                                start_addr_name: data2.start_addr_name,
                                repre_desc: data2.repre_desc,
                                status: data2.status
                            };
                            kq.kq_result = {};
                            if (data2.status === 2) {
                                kq.kq_result.status_result = '迟到:'+data2.late_mins+'分钟';
                            }else if (data2.status === 3) {
                                kq.kq_result.status_result = '早退:'+data2.early_mins+'分钟';
                            }else if (data2.status === 4) {
                                kq.kq_result.status_result = '迟到+早退共:'+(data2.late_mins + early_mins)+'分钟';
                            }else if (data2.status === 5) {
                                kq.kq_result.status_result = '旷工';
                            }else if (data2.status === 6) {
                                kq.kq_result.status_result = '未签退';
                            }else{
                                kq.kq_result.status_result = null
                            }
                            if (data2.start_addr_name == null) {
                                kq.kq_result.addr_ex = '位置异常';
                            }
                            if (data2.overtime_mins > 0) {
                                kq.kq_result.overtime_mins = data2.overtime_mins;
                            }
                            kq_detail.kq.list.push(kq);
                        });
                    }else{
                        kq_detail.kq = {};
                    }
                    result=kq_detail;
                });
                res.json(result);
            }else{
                res.json('未查询到相关信息');
            }
        });
    }
}