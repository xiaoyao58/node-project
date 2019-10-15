var moment = require('moment');
var uuid = require('uuid');
module.exports = {
    default_pb_set: function (req, res) {
        var defult_bc = "787127caae5e43afa0f5670fc8d99df8";

        var mon_bc = req.param('mon_bc');
        var tue_bc = req.param('tue_bc');
        var wed_bc = req.param('wed_bc');
        var thu_bc = req.param('thu_bc');
        var fri_bc = req.param('fri_bc');
        var sat_bc = req.param('sat_bc');
        var sun_bc = req.param('sum_bc');

        var mon = mon_bc ? mon_bc : defult_bc;
        var tue = tue_bc ? tue_bc : defult_bc;
        var wed = wed_bc ? wed_bc : defult_bc;
        var thu = thu_bc ? thu_bc : defult_bc;
        var fri = fri_bc ? fri_bc : defult_bc;
        var sat = sat_bc ? sat_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        var sun = sun_bc ? sun_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');
        BaseSevice.exec_sql('update kq_pb set mon = ?,tue = ?,wed = ?,thu = ?,fri = ?,sat = ?,sun = ?,update_at = ? where pb_id = "9bece1fcf9ca4e5a99d55699401ec37f"', [mon, tue, wed, thu, fri, sat, sun, update_at], (err, data) => {
            if (err) {
                sails.log(err);
            }
            if (!_.isEmpty(data)) {
                res.json('insert success');
            }
        });

    },
    defualt_pb_find: function (req, res) {
        var result = {};
        BaseService.exec_sql('select * from kq_pb where pb_id = "9bece1fcf9ca4e5a99d55699401ec37f"', [], (err, found) => {
            if (err) {
                sails.log(err);
            }
            if (!_.isEmpty(found)) {
                _.forEach(found, (f) => {
                    result.pb_id = f.pb_id;
                    result.mon = f.mon;
                    result.tue = f.tue;
                    result.wed = f.wed;
                    result.thu = f.thu;
                    result.fri = f.fri;
                    result.sat = f.sat;
                    result.sun = f.sun;
                });
                res.json(result);
            }
        });
    },
    except_pb_set: function (req, res) {
        var pb_id = req.param('pb_id');
        pb_id = pb_id ? pb_id : "67e7aacf7bfd43e3bba94bfdf076b296";
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var rule_date = req.param('rule_date');
        // var date = req.param('date');
        // date = date?date:moment().startOf('week').subtract('week',-1);
        // var start=moment(date).startOf('week').add('day',1).format('YYYY-MM-DD');
        // var end = moment(date).endOf('week').add('day',1).format('YYYY-MM-DD');
        if (!_.isEmpty(rule_date)) {
            _.forEach(rule_date, (rd) => {
                BaseService.exec_sql('insert into kq_rule_date(pb_id,rule_date,bc_id,create_at) values(?,?,?,?)', [pb_id, rd.rule_date, rd.bc_id, create_at], (err) => {
                    if (err) {
                        sails.log(err);
                    }
                });
            });
        }

        // BaseService.exec_sql('insert into pb_bc(pb_id,project_id,type,name,mon,tue,wed,thu,fri,sat,sun,create_at,update_at,is_sys,bc_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[pb_id,project_id,type,name,mon,tue,wed,thu,fri,sat,sun,create_at,update_at,is_sys,bc_id],(err,data)=>{
        //     if(err){
        //         return sails.log(err);
        //     }
        //     if(data){
        //         res.json('insert success');
        //     }
        // });
    },
    except_pb_select: function (req, res) {
        var pb_id = "67e7aacf7bfd43e3bba94bfdf076b296";
        var date = req.param('date');
        date = date ? date : moment().startOf('week').subtract('week', -1);
        var start = moment(date).startOf('week').add('day', 1).format('YYYY-MM-DD');
        var result = {};
        result.list = [];
        BaseService.exec_sql('select rule_date,bc_id from kq_rule_date where pb_id = ? and rule_date>=?', [pb_id, start], (err, data) => {
            if (err) {
                sails.log(err);
            }
            if (data && !_.isEmpty(data)) {
                _.forEach(data, (data) => {
                    var rd = {};
                    rd.rule_date = moment(data.rule_date).format('YYYY-MM-DD');
                    rd.bc_id = data.bc_id;
                    result.list.push(rd);
                });
                res.json(result);
            } else {
                res.json(null);
            }
        });
    },
    bc_set: function (req, res) {
        var bc_id = uuid.v4();
        var project_id = req.token.project_id;
        var bc_name = req.param('bc_name');
        var start_time = req.param('start_time');
        var end_time = req.param('end_time');
        var is_default = parseInt(req.param('is_default'));
        var is_elastic = ParseInt(req.param('is_elastic'));
        var max_elastic = parseInt(req.param('max_elastic'));
        var is_overtime = parseInt(req.param('is_overtime'));
        var max_overtime = parseInt(req.param('max_overtime'));
        var ahead_time = parseInt(req.param('ahead_time'));
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');

        BaseService.exec_sql('insert into kq_bc(bc_id,project_id,name,start_time,end_time,is_default,is_elastic,max_elastic,is_overtime,max_overtime,ahead_time,create_at,update_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?)', [bc_id, project_id, bc_name, start_time, end_time, is_default, is_elastic, max_elastic, is_overtime, max_overtime, ahead_time, create_at, update_at], (err) => {
            if (err) {
                return sails.log(err);
            }
        });
    },
    bc_edit: function (req, res) {
        var bc_id = req.param('bc_id');
        var project_id = req.token.project_id;
        var leave_time = req.param('leave_time');
        var bc_name = req.param('bc_name');
        var start_time = req.param('start_time');
        var end_time = req.param('end_time');
        var is_default = parseInt(req.param('is_default'));
        var is_elastic = ParseInt(req.param('is_elastic'));
        var max_elastic = parseInt(req.param('max_elastic'));
        var is_overtime = parseInt(req.param('is_overtime'));
        var max_overtime = parseInt(req.param('max_overtime'));
        var ahead_time = parseInt(req.param('ahead_time'));
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');

        BaseService.exec_sql('update kq_bc set project_id=?,name=?,start_time=?,end_time=?,is_default=?,is_elastic=?,max_elastic=?,is_overtime=?,max_overtime=?,ahead_time=?,create_at=?,update_at=? where bc_id = ?', [project_id, bc_name, start_time, end_time, is_default, is_elastic, max_elastic, is_overtime, max_overtime, ahead_time, create_at, update_at, bc_id], (err) => {
            if (err) {
                return sails.log(err);
            }
        });


        if (!_.isEmpty(leave_time)) {
            _.forEach(leave_time, (lt) => {
                var start_time = lt.start_time;
                var end_time = lt.end_time;
                var days = lt.days;
                BaseService.exec_sql('delete from kq_bc_leave where bc_id = ?', [bc_id], (err) => {
                    if (err) {
                        return sails.log(err);
                    }
                    BaseService.exec_sql('insert into kq_bc_leave(bc_id,start_time,end_time,days,create_at) values(?,?,?,?,?)', [bc_id, start_time, end_time, days, create_at], (err, data) => {
                        if (err) {
                            return sails.log(err);
                        }
                    });
                });
            });
        }
    },
    bc_delete: function (req, res) {
        var bc_id = req.param('bc_id');
        BaseService.exec_sql('delete from kq_bc where bc_id = ?', [bc_id], (err) => {
            if (err) {
                sails.log(err);
            }
        })
    },
    bc_select: function (req, res) {
        var result = {};
        result.list = [];
        BaseService.exec_sql('select * from kq_bc', [], (err, data) => {
            if (err) {
                sails.log(err);
            }
            if (!_.isEmpty(data)) {
                _.forEach(data, (d) => {
                    var bc = {};
                    bc.bc_id = d.bc_id;
                    bc.name = d.name;
                    bc.start_time = d.start_time;
                    bc.end_time = d.end_time;
                    bc.is_default = d.is_default;
                    bc.is_elastic = d.is_elastic;
                    bc.max_elastic = d.max_elastic;
                    bc.is_overtime = d.is_overtime;
                    bc.max_overtime = d.max_overtime;
                    bc.ahead_time = d.ahead_time;
                    result.list.push(bc);
                });
                res.json(result);
            }
        })
    },
    sys_setting: function (req, res) {
        var project_id = req.token.project_id;
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var setting_info = req.param('setting_info');
        if (!_.isEmpty(setting_info)) {
            _.forEach(setting_info, (si) => {
                var setting_name = si.setting_name;
                var setting_value = si.setting_value;
                BaseService.exec_sql('update app_setting set setting_value = ?,update_at = ? where setting_name = ? and project_id = ?', [setting_value, update_at, setting_name, project_id], (err) => {
                    if (err) {
                        sails.log(err);
                    }
                })
            })
        }
    },
    //添加考勤点
    kq_addr_create: function (req, res) {
        var addr_id = uuid.v4();
        var name = req.param('name');
        var addr_desc = req.param('addr_desc');
        var lng = req.param('lng');
        var lat = req.param('lat');
        var radius = parseInt(req.param('radius'));
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var project_id = req.token.project_id;
        var status = 1;
        var province = req.param('province');
        var city = req.param('city');
        var dept_id = (req.param('dept_id'))?(req.param('dept_id')):null;
        var create_user = req.token.user_id;
        var type = (req.param('type'))?(parseInt(req.param('type'))):1;
        BaseService.exec_sql('insert into kq_addr(addr_id,name,addr_desc,lng,lat,radius,create_at,update_at,project_id,status,province,city,dept_id,create_user,type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[addr_id,name,addr_desc,lng,lat,radius,create_at,update_at,project_id,status,province,city,dept_id,create_user,type],(err,data)=>{
            if(err){
                return sails.log(err);
            }
            if(data){
                return res.json('insert success!');
            }
        })
    }
}