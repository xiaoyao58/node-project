var moment = require('moment');
var fs = require('fs');
var request = require('request');
var uuid = require('uuid');
var xlsx = require('node-xlsx');
module.exports = {
    //获取部门
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
    //部门流程查询
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
    //部门年假查询
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
                        year_leave.user.avatar = 'http://10.2.100.151:1337/images/' + (data0.avatar ? data0.avatar : '4a06f622-028a-4323-97ef-a58326006f88.jpeg');
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
    //班次查询
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
    //创建部门排班
    create_dept_pb: function (req, res) {
        var user_id = req.token.user_id;
        var dept_id = req.param('dept_id');
        var scope_get = req.param('scope');
        var name = req.param('name');
        var scope = scope_get ? scope_get : 1;

        var pb_id = uuid.v4().substring(21);

        var project_id = req.param('project_id');
        project_id = project_id ? project_id : 'D5AB602D-745E-4A08-9D90-E0F45DD33FC5';

        var type = req.param('type');
        type = type ? parseInt(type) : parseInt(1);

        var mon_bc = req.param('mon_bc');
        var tue_bc = req.param('tue_bc');
        var wed_bc = req.param('wed_bc');
        var thu_bc = req.param('thu_bc');
        var fri_bc = req.param('fri_bc');
        var sat_bc = req.param('sat_bc');
        var sun_bc = req.param('sum_bc');

        var mon = mon_bc ? mon_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var tue = tue_bc ? tue_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var wed = wed_bc ? wed_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var thu = thu_bc ? thu_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var fri = fri_bc ? fri_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var sat = sat_bc ? sat_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        var sun = sun_bc ? sun_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');

        var is_sys = req.param('is_sys');
        is_sys = is_sys ? is_sys : 0;

        var bc_id = req.param('bc_id');

        bc_id = bc_id ? bc_id : null;

        BaseService.exec_sql('insert into kq_pb(pb_id,project_id,`type`,`name`,mon,tue,wed,thu,fri,sat,sun,create_at,update_at,is_sys,bc_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [pb_id, project_id, type, name, mon, tue, wed, thu, fri, sat, sun, create_at, update_at, is_sys, bc_id], (err) => {
            if (err) {
                return sails.log(err);
            }
        });
        BaseService.exec_sql('insert into kq_pb_dept(pb_id,dept_id,scope,create_at) values(?,?,?,?)', [pb_id, dept_id, scope, create_at], (err) => {
            if (err) {
                return sails.log(err);
            }
        });
    },
    //年休假查询
    dept_leave_select: function (req, res) {
        var get_annual = req.param('annual');
        var user_id = req.param('user_id');

        var annual = get_annual ? get_annual : moment().get('year');
        var admin = req.token.user_id;
        var user_list = [];



        var result = {};
        result.list = [];
        BaseService.exec_sql('select user_id from wdzt.dept_user where dept_id = (select dept_id from wdzt.dept_user where user_id = ?)', [admin], (err, data) => {
            if (err) {
                return sails.log(err);
            }
            if (data && !_.isEmpty(data)) {
                _.forEach(data, (data) => {
                    var user_id = data.user_id;
                    if (user_id !== '') {
                        user_list.push(user_id);
                    }
                });
                if (!_.isEmpty(user_id)) {
                    user_list = _.filter(user_list, (f) => {
                        return f.user_id === user_id;
                    });
                }
            }
            BaseService.exec_sql('select u.user_id,u.`name`,u.job_number,ual.annual,ual.valid_to,ual.limited_days,ual.remaining_days from user_annual_leave ual inner join wdzt.users u on ual.user_id = u.user_id where ual.user_id in (?) and ual.annual = ?', [user_list, annual], (err, data) => {
                if (err) {
                    return sails.log(err);
                }
                if (data && !_.isEmpty(data)) {
                    _.forEach(data, (data) => {
                        var user_info = {
                            user_id: data.user_id,
                            name: data.name,
                            job_number: data.job_number,
                            annual: data.annual,
                            valid_to: moment(data.valid_to).format('YYYY-MM-DD: HH:mm:ss'),
                            limited_days: data.limited_days,
                            remaining_days: data.remaining_days
                        };
                        result.list.push(user_info);
                    });
                    res.json(result);
                }
            });

        });
    },

    //年假新增
    dept_leave_set: function (req, res) {
        var get_annual = req.param('annual');
        var user_id = req.param('user_id');
        var annual = get_annual ? get_annual : moment().get('year');
        var get_limited_days = req.param('limited_days');
        var limited_days = get_limited_days ? parseInt(get_limited_days) : 15;
        var remaining_days = limited_days;
        var valid_to = req.param('valid_to');

        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');

        BaseService.exec_sql('call sp_dept_set(?,?,?,?,?,?,?)', [user_id, annual, valid_to, limited_days, remaining_days, create_at, update_at], (err, data) => {
            if (err) {
                return sails.log(err);
            }
        });
    },
    //年假导入
    dept_leave_upload: function (req, res) {
        //定义文件上传的最大字节
        const MAXBYTES = 1024 * 1024 * 100;
        //定义文件上传的位置
        const FILE_PATH = '../../file/excel';
        //定义保存上传文件的名称
        var fileName = uuid.v4();

        var result = {};
        result.list = [];

        var user_id = '';
        var annual_list = [];
        var valid_to_list = [];
        var limited_days_list = [];
        var remaining_days_list = [];
        var create_at_list = [];
        var update_at_list = [];


        //获取文件
        var file = req.file('file').on('error', function (err) {
            return sails.log('文件上传超时');
        });

        var file_buffer = file._files[0].stream._readableState.buffer[0];

        var sheets = xlsx.parse(file_buffer);
        
        _.forEach(sheets, (sheet) => {
            console.log('sheet_name:' + sheet.name);
            var done = _.after(sheet.data.length-1,()=>{
                res.json(result);
            })
            for (var rowId in sheet['data']) {
                if (rowId === '0') {
                    var row = sheet['data'][rowId];
                    console.log('row:' + row);
                }
                if (rowId !== '0') {
                    var row = sheet['data'][rowId];
                    var user_name = row[0];
                    annual_list.push(row[3]);
                    valid_to_list.push(moment(new Date(1900, 0, row[4] - 1)).format('YYYY-MM-DD'));
                    limited_days_list.push(parseInt(row[5]));
                    remaining_days_list.push(parseInt(row[6]));
                    create_at_list.push(moment().format('YYYY-MM-DD HH:mm:ss'));
                    update_at_list.push(moment().format('YYYY-MM-MM HH:mm:ss'));

                    BaseService.exec_sql('select user_id from wdzt.users where `name`=?', [user_name], (err, data) => {
                        var annual = annual_list.shift();
                        var valid_to = valid_to_list.shift();
                        var limited_days = limited_days_list.shift();
                        var remaining_days = remaining_days_list.shift();
                        var create_at = create_at_list.shift();
                        var update_at = update_at_list.shift();
                        if (err) {
                            return sails.log(err);
                        }
                        if (data && !_.isEmpty(data)) {
                            _.forEach(data, (data) => {
                                user_id = data.user_id;
                            });
                            BaseService.exec_sql('call sp_dept_set(?,?,?,?,?,?,?)', [user_id, annual, valid_to, limited_days, remaining_days, create_at, update_at], (err, data) => {
                                if (err) {
                                    return sails.log(err);
                                }
                                if(data&&!_.isEmpty(data)){
                                    result.list.push(data);
                                }
                                done();
                            });
                        }
                    });

                }

            }
        });
    },

    create_user_pb: function (req, res) {
        var user_id = req.param('user_id');
        var user_id_list = user_id.split(',');
        var pb_sql = '';
        var pb_list = [];
        
        var name = req.param('name');
        var pb_id = uuid.v4().substring(21);

        var project_id = req.param('project_id');
        project_id = project_id ? project_id : 'D5AB602D-745E-4A08-9D90-E0F45DD33FC5';

        var type = req.param('type');
        type = type ? parseInt(type) : parseInt(1);

        var mon_bc = req.param('mon_bc');
        var tue_bc = req.param('tue_bc');
        var wed_bc = req.param('wed_bc');
        var thu_bc = req.param('thu_bc');
        var fri_bc = req.param('fri_bc');
        var sat_bc = req.param('sat_bc');
        var sun_bc = req.param('sum_bc');

        var mon = mon_bc ? mon_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var tue = tue_bc ? tue_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var wed = wed_bc ? wed_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var thu = thu_bc ? thu_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var fri = fri_bc ? fri_bc : '5e4cc4ea74844191a8bec4a29ffd25b0';
        var sat = sat_bc ? sat_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        var sun = sun_bc ? sun_bc : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');

        var is_sys = req.param('is_sys');
        is_sys = is_sys ? is_sys : 0;

        var bc_id = req.param('bc_id');

        bc_id = bc_id ? bc_id : null;

    
        for(var i = 0 ;i<user_id_list.length;i++){
            var sql = 'insert into kq_pb_user(pb_id,user_id,create_at) values(?,?,?);'
            pb_sql +=sql;
            pb_list.push(pb_id,user_id_list[i],create_at);
            
        }
        BaseService.exec_sql('insert into kq_pb(pb_id,project_id,`type`,`name`,mon,tue,wed,thu,fri,sat,sun,create_at,update_at,is_sys,bc_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [pb_id, project_id, type, name, mon, tue, wed, thu, fri, sat, sun, create_at, update_at, is_sys, bc_id], (err) => {
            if (err) {
                return sails.log(err);
            }
        });
        BaseService.exec_sql(pb_sql, pb_list, (err,data) => {
            if (err) {
                return sails.log(err);
            }else{
                res.json(data);
            }
        });
    },
    get_bc: function(req,res){
        var bc_id = req.param('bc_id');
        var bc= {};
        bc_id = bc_id?bc_id:'787127caae5e43afa0f5670fc8d99df8';
        BaseService.exec_sql('select * from kq_bc where bc_id = ?',[bc_id],(err,data)=>{
            if(err){
                return sails.log(err);
            }
            if(!_.isEmpty(data)){
                _.forEach(data,(data)=>{
                    bc.bc_id = data.bc_id;
                    bc.project_id = data.project_id;
                    bc.name = data.name;
                    bc.start_time = data.start_time;
                    bc.end_time = data.end_time;
                    bc.is_default = data.is_default;
                    bc.max_elastic = data.max_elastic;
                    bc.is_overtime = data.is_overtime;
                    bc.max_overtime = data.max_overtime;
                    bc.ahead_time = data.ahead_time;
                });
                return res.json(bc);
            }else{
                res.json('无该班次信息');
            }
        })
    },
    //日历调班查询
    calendar_tb_select: function(req,res){
        var admin = req.token.user_id;
        var get_start = req.param('start');
        var get_end = req.param('end');
        var start = get_start?moment(get_start).format('YYYY-MM-DD'):moment().startOf('week').add(1,'day').format('YYYY-MM-DD');
        var end = get_end?moment(get_end).format('YYYY-MM-DD'): moment().endOf('week').add(1,'day').format('YYYY-MM-DD');
        var user_id = req.param('user_id');
        if(!_.isEmpty(user_id))
        var today = moment().format('YYYY-MM-DD');
        var tb = {};
        tb.list = [];

       
        BaseService.exec_sql('select du.dept_id,d.simple_name from wdzt.dept_user du,wdzt.dept d where du.dept_id = d.dept_id and du.user_id = ?',[admin],(err,data)=>{
            if(err){
                return sails.log(err);
            }
            if(!_.isEmpty(data)){
                _.forEach(data,(data)=>{
                    var dept_id = data.dept_id;
                    var dept_name = data.simple_name;
                    BaseService.exec_sql('select user_id from wdzt.dept_user where dept_id = ?',[dept_id],(err,data)=>{
                        if(err){
                            return sails.log(err);
                        }
                        if(!_.isEmpty(data)){
                            var done = _.after(data.length,()=>{
                                if(!_.isEmpty(user_id)){
                                    tb.list = _.filter(tb.list,(t)=>{
                                        return user_id.indexOf(t.user_id) !== -1;
                                    });
                                }
                                return res.json(tb);
                            })
                            _.forEach(data,(user)=>{
                                BaseService.exec_sql('select * from kq_pb_user where user_id = ?;select * from kq_pb_date where user_id = ? and rule_date>=? and rule_date<=?',[user.user_id,user.user_id,start,end],(err,data_user)=>{
                                    if(err){
                                        return sails.log(err);
                                    }
                                    if(!_.isEmpty(data_user[0])){
                                        BaseService.exec_sql('select u.`name`,u.user_id,kp.mon,kp.tue,kp.wed,kp.thu,kp.fri,kp.sat,kp.sun from kq_pb kp inner join kq_pb_user kpu on kp.pb_id = kpu.pb_id inner join wdzt.users u on u.user_id = kpu.user_id where kpu.user_id = ?',[user.user_id],(err,data)=>{
                                            if(err){
                                                return sails.log(err);
                                            }
                                            if(!_.isEmpty(data)){
                                                _.forEach(data,(data)=>{
                                                    var t = {};
                                                    t.name = data.name;
                                                    t.user_id = data.user_id;
                                                    t.mon = data.mon;
                                                    t.tue = data.tue;
                                                    t.wed = data.wed;
                                                    t.thu = data.thu;
                                                    t.fri = data.fri;
                                                    t.sat = data.sat;
                                                    t.sun = data.sun;
                                                    if(!_.isEmpty(data_user[1])){
                                                        
                                                        _.forEach(data_user[1],(u)=>{
                                                            var week = moment(u.rule_date).day();
                                                            if(week === 1){
                                                                t.mon = u.bc_id;
                                                            }
                                                            if(week === 2){
                                                                t.tue = u.bc_id;
                                                            }
                                                            if(week === 3){
                                                                t.wed = u.bc_id;
                                                            }
                                                            if(week === 4){
                                                                t.thu = u.bc_id;
                                                            }
                                                            if(week === 5){
                                                                t.fri = u.bc_id;
                                                            }
                                                            if(week === 6){
                                                                t.sat = u.bc_id;
                                                            }
                                                            if(week === 0){
                                                                t.sun = u.bc_id;
                                                            }
                                                        });
                                                    }
                                                    tb.list.push(t);
                                                });
                                                done();
                                            }
                                        })
                                    }else{
                                        BaseService.exec_sql('select * from kq_pb kp,kq_pb_dept kpd where kp.pb_id = kpd.pb_id and dept_id = ?',[dept_id],(err,data)=>{
                                            if(err){
                                                return sails.log(err);
                                            }
                                            if(!_.isEmpty(data)){
                                                _.forEach(data,(data)=>{
                                                    var t = {};
                                                    t.name = data.name;
                                                    t.user_id = data.user_id;
                                                    t.mon = data.mon;
                                                    t.tue = data.tue;
                                                    t.wed = data.wed;
                                                    t.thu = data.thu;
                                                    t.fri = data.fri;
                                                    t.sat = data.sat;
                                                    t.sun = data.sun;
                                                    tb.list.push(t);
                                                });
                                                done();
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    },
    //日历调班设置
    calendar_tb_set: function(req,res){
        var user_id = req.param('user_id');
        var date = req.param('date');
        var bc_id = req.param('bc_id');
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var update_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var project_id = req.param('project_id');
        project_id = project_id?project_id:'D5AB602D-745E-4A08-9D90-E0F45DD33FC5';

        if(moment(date).format('YYYY-MM-DD')>moment().format('YYYY-MM-DD')){
            BaseService.exec_sql('call sp_calendar_pb_set(?,?,?,?,?,?)',[user_id,date,bc_id,create_at,update_at,project_id],(err,data)=>{
                if(err){
                    return sails.log(err);
                }
                if(!_.isEmpty(data)){
                    return res.json(data);
                }
            })
        }
    },
    //文件下载
    file_download: function (req, res) {
        var filePath = 'assets/images/6b3058f8-2b68-4d1c-9123-26dca65979d9.jpg';
        var stream = fs.createReadStream(filePath);
        var stats = fs.statSync(filePath);
        var ua = req.headers['user-agent'];
        console.log(ua);
        if (stats.isFile()) {
            res.set({
                'Content-Type': 'image/jpeg',
                'Content-Disposition': 'attachment;filename=new.jpg',
                'Content-Length': stats.size
            });
            stream.pipe(res);
        } else {
            res.end(404);
        }
    },
    //文件上传
    file_upload: function (req, res) {
        //定义文件上传的最大字节
        const MAXBYTES = 1024 * 1024 * 100;
        //定义文件上传的位置
        const FILE_PATH = '../../assets/images';
        //定义保存上传文件的名称
        var fileName = uuid.v4();

        //获取文件
        var file = req.file('file').on('error', function (err) {
            console.log(err);
            return sails.log('文件上传超时');
        });
        FileUploadService.file_upload(MAXBYTES, FILE_PATH, fileName, file, (err, data) => {
            if (err) {
                return sails.log(err);
            }
            res.json({
                errcode: data.errcode,
                errdesc: data.errdesc,
                uploadedFiles: data.uploadedFiles
            });
        });
    }
}