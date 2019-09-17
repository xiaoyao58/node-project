var moment = require('moment');
var uuid = require('node-uuid');
module.exports ={
    exec_insert : function(conv_id,user_id,msg){
        var create_user = user_id;
        
        var conv_id = conv_id;
        var msg_id = 'msg_'+uuid.v4();
        var message = msg;
        var create_at = moment().format('YYYY-MM-DD hh:mm:ss');
        var create_at = new Date();
        BaseService.exec_sql('select user_name from users where user_id = ?;select conv_id from conv',[user_id],(err,data)=>{
            if(err){
                sails.log(err);
                return 0;
            }
            var list_conv = [];
            _.forEach(data[1],(data)=>{
                list_conv.push(data.conv_id);
            })
            if(data&&list_conv.indexOf(conv_id)!==-1){
                _.forEach(data[0],(data)=>{
                    BaseService.exec_sql('insert into conv_member(conv_id,user_id,user_name) values(?,?,?);insert into conv_msg(msg_id,msg,create_at,conv_id,from_user) values(?,?,?,?,?)',[conv_id,create_user,data.user_name,msg_id,message,create_at,conv_id,create_user],(err,data)=>{
                        if(err){
                            sails.log(err);
                        }
                    });
                })
            }
            
        })
        
        
        
    }
};