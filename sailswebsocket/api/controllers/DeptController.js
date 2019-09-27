var moment = require('moment');

var request = require('request');
module.exports = {
    get_dept: function (req, res) {
        var user_id = req.param('user_id');
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
        var dept_id = req.param('dept_id');
        var result = {};
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
                                                user.avatar = data.avatar;
                                                if (user === undefined) {
                                                    user = null;
                                                    activity.user = null;
                                                }else{
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
}