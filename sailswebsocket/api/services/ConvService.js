var moment = require('moment');
var uuid = require('node-uuid');
module.exports ={
    exec_insert : function(user_id,conv_name){
        var conv_name = conv_name;
        var create_user = user_id;
        var conv_id = 'conv_'+uuid.v4();
        var create_at = moment().format('YYYY-MM-DD hh:mm:ss');
        var create_at = new Date();
        BaseService.exec_sql('insert into conv(conv_id,conv_name,create_user,create_at) values(?,?,?,?)',[conv_id,conv_name,create_user,create_at],(err,data)=>{
            if(err){
                sails.log(err);
            }
        });
        BaseService.exec_sql('select user_name from users where user_id = ?',[create_user],(err,data)=>{
            if(err){
                sails.log(err);
            }
            if(data){
                _.forEach(data,(data)=>{
                    ConvMemberService.exec_insert('insert into conv_member(conv_id,user_id,user_name) values(?,?,?)',[conv_id,create_user,data.user_name]);
                });
            }
        });
        
        
    }
};