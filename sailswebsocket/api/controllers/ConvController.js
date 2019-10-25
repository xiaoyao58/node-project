var moment = require('moment');
var uuid= require('uuid');
module.exports = {
    //对话列表
    conv_list: function(req,res){
        var user_id = req.token.user_id;
        var conv = {};
        conv.conv_list = [];
        var sql = "select conv_id from wdzt.conv_member where user_id = ? order by create_at desc";
        BaseService.exec_sql("select conv_id from wdzt.conv_member where user_id = ? order by create_at desc",[user_id],(err,data)=>{
            if(err){
                return res.ok(err);
            }
            if(data&&!_.isEmpty(data)){
                var done = _.after(data.length,()=>{
                    return res.json(conv);
                })
                _.forEach(data,(d)=>{
                    BaseService.exec_sql("select * from wdzt.conv where conv_id = ?",[d.conv_id],(err,data_conv)=>{
                        if(err){
                           return sails.log.error(err);
                        }
                        if(data_conv&&!_.isEmpty(data_conv)){
                            _.forEach(data_conv,(dc)=>{
                                var cl = {
                                    conv_id: dc.conv_id,
                                    conv_name: dc.conv_name,
                                    conv_desc: dc.conv_desc,
                                    conv_type: dc.conv_type,
                                    create_user: dc.create_user,
                                    create_at: moment(dc.create_at).format('YYYY-MM-DD HH:mm:ss'),
                                    active_at: moment(dc.active_at).format('YYYY-MM-DD HH:mm:ss'),
                                    conv_status: dc.conv_status,
                                    avatar: dc.avatar
                                };
                                conv.conv_list.push(cl);
                            });
                            done();
                        }
                    });
                });
            }
        });
    },
    //按姓氏拼音排序,筛选
    get_user_by_py: function(req,res){
        var keyword = req.param('keyword');
        var result = {};
        result.users = [];
        BaseService.exec_sql('select u.user_id,u.`name`,u.avatar,d.path_simple,d.simple_name from wdzt.users u,wdzt.dept_user du,wdzt.dept d where u.user_id = du.user_id and d.dept_id = du.dept_id and du.is_main = 1 order by u.`name`',[],(err,users)=>{
            if(err){
                sails.log.error(err);
            }
            if(users&&!_.isEmpty(users)){
                _.forEach(users,(u)=>{
                    var user = {}
                    user.user_id = u.user_id;
                    user.name = u.name;
                    user.avatar = u.avatar;
                    // user.path_simple = u.path_simple;
                    // user.simple_name = u.simple_name;
                    user.path_simple_name = u.path_simple+u.simple_name;
                    result.users.push(user);
                });
                if(_.isEmpty(keyword)){
                    res.json(result);
                }else{
                    result.users = _.filter(result.users,(u)=>{
                       return u.name.indexOf(keyword) !== -1;
                    });
                    res.json(result);
                }
                
            }
        });
    },
    //按部门筛选
    get_user_by_dept: function(req,res){
        var dept_name = req.param('dept_name');
        var result = {};
        result.depts = [];
        BaseService.exec_sql('select dept_id,dept_name,simple_name,path_name,path_simple,num_users,direct_users,parent_id from wdzt.dept',[],(err,depts)=>{
            if(err){
                sails.log.error(err);
            }
            var done = _.after(depts.length,()=>{
                if(_.isEmpty(dept_name)){
                    result.depts = result.depts;
                }else{
                    result.depts = _.filter(result.depts,(d)=>{
                        return d.dept_name.indexOf(dept_name) !==-1;
                    });
                }
                return res.json(result);
            })
            if(depts&&!_.isEmpty(depts)){
                
                _.forEach(depts,(d)=>{
                    var dept = {};
                dept.dept_id = d.dept_id;
                dept.dept_name = d.dept_name;
                dept.simple_name = d.simple_name;
                dept.path_name = d.path_name;
                dept.path_simple = d.path_simple;
                dept.num_usres = d.num_users;
                dept.direct_users = d.direct_users;
                dept.parent_id = d.parent_id;
                dept.users = [];
                    BaseService.exec_sql('select u.user_id,u.`name`,u.avatar from wdzt.users u,wdzt.dept_user du where u.user_id = du.user_id and du.dept_id = ?',[d.dept_id],(err,users)=>{
                        if(err){
                            sails.log.error(err);
                        }
                        if(users&&!_.isEmpty(users)){
                            _.forEach(users,(u)=>{
                                var user = {};
                                user.user_id = u.user_id;
                                user.name = u.name;
                                user.avatar = u.avatar;
                                dept.users.push(user);
                            });
                            
                        }
                        result.depts.push(dept);
                            done();
                    });
                    
                });
            }
        });
    },
    get_user_by_groups: function(req,res){
        var me = req.token.user_id;
        var keyword = req.param('keyword');
        var result = {};
        result.groups_my = [];
        result.groups_others = [];
        BaseService.exec_sql('select distinct g.group_id,group_name,g.avatar,g.num_user from wdzt.groups g,wdzt.group_user gu where g.group_id = gu.group_id and gu.user_id = ?;select distinct g.group_id,group_name,avatar,num_user from wdzt.groups g,wdzt.group_user gu where g.group_id = gu.group_id and g.`status` = 1 and g.is_hidden = 0 and gu.user_id != ?',[me,me],(err,groups)=>{
            if(err){
                sails.log.error(err);
            }
            if(groups[0]&&!_.isEmpty(groups[0])){
                var groups_my = groups[0];
                if(!_.isEmpty(keyword)){
                    groups_my = _.filter(groups_my,(gm)=>{
                        return gm.group_name.indexOf(keyword) !== -1;
                    });
                }
                _.forEach(groups_my,(gm)=>{
                    var group = {};
                    group.group_id = gm.group_id;
                    group.group_name = gm.group_name;
                    group.avatar = gm.avatar;
                    group.num_user = gm.num_user;
                    group.users = [];
                    BaseService.exec_sql('select u.user_id,u.`name`,u.avatar,d.path_simple,d.simple_name,d.dept_name from wdzt.users u,wdzt.dept_user du,wdzt.dept d,wdzt.group_user gu where u.user_id = du.user_id and d.dept_id = du.dept_id and u.user_id = gu.user_id and du.is_main = 1 and gu.group_id = ? order by u.`name`',[gm.group_id],(err,users)=>{
                        if(err){
                            sails.log.error(err);
                        }
                        if(users&&!_.isEmpty(users)){
                            _.forEach(users,(u)=>{
                                var user = {};
                                user.user_id = u.user_id;
                                user.name = u.name;
                                user.avatar = u.avatar;
                                user.dept_name = u.dept_name;
                                group.users.push(user);
                            });
                            result.groups_my.push(group);
                        }
                    });
                });
            }
            if(groups[1]&&!_.isEmpty(groups[1])){
                var groups_others = groups[1];
                if(!_.isEmpty(keyword)){
                    groups_others = _.filter(groups_others,(go)=>{
                        return go.group_name.indexOf(keyword) !== -1;
                    });
                }
                var done = _.after(groups_others.length,()=>{
                    return res.json(result);
                })
                _.forEach(groups_others,(go)=>{
                    var group = {};
                    group.group_id = go.group_id;
                    group.group_name = go.group_name;
                    group.avatar = go.avatar;
                    group.num_user = go.num_user;
                    group.users = [];
                    BaseService.exec_sql('select u.user_id,u.`name`,u.avatar,d.path_simple,d.simple_name,d.dept_name from wdzt.users u,wdzt.dept_user du,wdzt.dept d,wdzt.group_user gu where u.user_id = du.user_id and d.dept_id = du.dept_id and u.user_id = gu.user_id and du.is_main = 1 and gu.group_id = ? order by u.`name`',[go.group_id],(err,users)=>{
                        if(err){
                            sails.log.error(err);
                        }
                        if(users&&!_.isEmpty(users)){
                            _.forEach(users,(u)=>{
                                var user = {};
                                user.user_id = u.user_id;
                                user.name = u.name;
                                user.avatar = u.avatar;
                                user.dept_name = u.dept_name;
                                group.users.push(user);
                            });
                            result.groups_others.push(group);
                        }
                        done();
                    });
                });
            }
        });
    },
    add_conv: function(req,res){
        var conv_id = uuid.v4();
        var conv_name = req.param('name');
        var conv_desc = req.param('conv_desc')?req.param('conv_desc'):null;
        var conv_type = req.param("conv_type")
        var create_user = req.token.user_id;
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var project_id = req.token.project_id;
        var active_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var sysconv_id = req.param('sysconv_id')?req.param('sysconv_id'):null;
        var sysconv_user = req.param('sysconv_user')?req.param('sysconv_user'):null;
        var conv_status = req.param('conv_status')?req.param('conv_status'):null;
        var avatar = req.param('avatar')?req.param('avatar'):null;


        var user_id = req.param('user_id');
        var is_remin = req.param('is_remain')?parseInt(req.param('id_remind')):0;
        var is_top = req.param('is_top')?parseInt(req.param('is_top')):0;
        var last_read_at = moment().format('YYYY-MM-DD HH:mm:ss');

        var sql = 'insert into wdzt.conv_member(conv_id,user_id,is_remind,is_top,last_read_at,create_user,create_at) values';
        var params = [];
        var i = 0;
        if(!_.isEmpty(user_id)){
            _.forEach(user_id.split(','),(ui)=>{
                i++;
                if(i === user_id.split(',').length){
                    sql = sql + '(?)';
                }else{
                    sql = sql + '(?),';
                }
                var param = [conv_id,ui,is_remin,is_top,last_read_at,create_user,create_at];
                params.push(param);
            });
        }
        BaseService.exec_sql('insert into wdzt.conv(conv_id,conv_name,conv_desc,conv_type,create_user,create_at,project_id,active_at,sysconv_id,sysconv_user,conv_status,avatar) values(?,?,?,?,?,?,?,?,?,?,?,?);',[conv_id,conv_name,conv_desc,conv_type,create_user,create_at,project_id,active_at,sysconv_id,sysconv_user,conv_status,avatar],(err)=>{
            if(err){
                sails.log.error(err);
            }else{
                sails.log.info('conv insert success');
            }
        });
        BaseService.exec_sql(sql,params,(err)=>{
            if(err){
                sails.log.error(err);
            }else{
                sails.log.info('conv_member insert success');
            }
        });
    },
    add_conv_msg: function(req,res){
        var msg_id = uuid.v4();
        var conv_id = req.param('conv_id');
        var msg = req.param('msg');
        var msg_type = req.param('msg_type')?parseInt(req.param('msg_type')):0;
        var from_user = req.token.user_id;
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var project_id = req.token.project_id;
        var link_thumb = req.param('link_thumb');
        var link_url = req.param('link_url');
        var link_title = req.patam('link_title');

        BaseService.exec_sql('insert into wdzt.conv_msg(msg_id,conv_id,msg,msg_type,from_user,create_at,project_id,link_thumb,link_url,link_title) values(?,?,?,?,?,?,?,?,?,?)',[msg_id,conv_id,msg,msg_type,from_user,create_at,project_id,link_thumb,link_url,link_title],(err)=>{
            if(err){
                sails.log.error(err);
            }
        });

    },
    add_msg_read: function(req,res){
        var msg_id = req.param('msg_id');
        var user_id = req.token.user_id;
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        BaseService.exec_sql('insert into wdzt.msg_read(msg_id,user_id,create_at) values(?,?,?) on duplicate key update creat_at = ?',[msg_id,user_id,create_at,create_at],(err)=>{
            if(err){
                sails.log.error(err);
            }
        });
    },
    send_msg: function(req,res){
        var conv_id = req.param('conv_id');
        var user = req.token.user_id;
        if(!req.isSocket){
            return res.badRequest();
        }
        var message = {};
        sails.sockets.join(req,conv_id);
        BaseService.exec_sql('select * from conv_msg where conv_id = ? order by create_at desc limit 1 offset 0',[conv_id],(err,msgs)=>{
            if(err){
                sails.log.error(err);
            }
            if(msgs&&!_.isEmpty(msgs)){
                _.forEach(msgs,(m)=>{
                    message.msg_id = m.msg_id;
                    message.msg = m.msg;
                    message.msg_type = m.msg_type;
                    message.send_user = m.from_user;
                    message.send_time = moment(m.create_at).format('YYYY-MM-DD HH:mm:ss');
                });
            }
            sails.sockets.broadcast(conv_id,message);
        })
    },
    record_conv: function(req,res){
        var conv_id = req.param('conv_id');
        var user = req.token.user_id;
        if (!req.isSocket) {
			return res.badRequest();
        }
        var record = {};
        record.message = [];
        BaseService.exec_sql('select * from wdzt.conv_msg where conv_id = ?',[conv_id],(err,msgs)=>{
            if(err){
                sails.log.error(err);
            }
            if(msgs&&!_.isEmpty(msgs)){
                _.forEach(msgs,(m)=>{
                    var re = {};
                    re.msg_id = m.msg_id;
                    re.msg = m.msg;
                    re.msg_type = m.msg_type;
                    re.send_user = m.from_user;
                    re.send_time = moment(m.create_at).format('YYYY-MM-DD HH:mm:ss');
                    record.message.push(re);
                });
              return res.json(record);
            }
        });
    }
}