var moment = require('moment');
var uuid = require('node-uuid');
module.exports ={
    exec_insert : function(conv_id,user_id,msg,callback){
        var create_user = user_id;
        
        var conv_id = conv_id;
        var msg_id = 'msg_'+uuid.v4();
        var message = msg;
        var create_at = moment().format('YYYY-MM-DD HH:mm:ss');
        var create_at = new Date();
        BaseService.exec_sql('select user_name from users where user_id = ?;select conv_id from conv',[user_id],(err,data)=>{
            if(err){
                sails.log(err);
                
                if (callback) {  
                    return callback(err);  
                }  
            }
            var list_conv = [];
            _.forEach(data[1],(data)=>{
                list_conv.push(data.conv_id);
            });
            if(data&&list_conv.indexOf(conv_id)!==-1){
                var done = _.after(data[0].length,()=>{
                    if (callback) {  
                        return callback();  
                    }  
                })
                _.forEach(data[0],(data)=>{
                    BaseService.exec_sql('call sp_save_message(?,?,?,?,?,?)',[conv_id,create_user,data.user_name,msg_id,message,create_at],(err,data)=>{
                        if(err){
                            sails.log(err);
                            if (callback) {  
                                return callback(err);  
                            }  
                        }
                        done();
                    });
                });
                
            }
            if (callback) {  
               return callback();  
            }  
            // return cb(null,data);
        });
        
        if (callback) {  
            return callback();  
         } 
         console.log('end..................');
    }
};