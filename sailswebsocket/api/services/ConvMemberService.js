module.exports = {
    exec_insert : function(conv_id,user_id){
        var conv_id = conv_id;
        var user_id = user_id;
        var user_name = '';
        BaseService.exec_sql('select user_name from users where user_id = ?',[user_id],(err,data)=>{
            if(err){
                sails.log(err);
                return err;
            }
            if(data){
                _.forEach(data,(data)=>{
                    user_name = data.user_name;
                });
            }
        });
    }
}