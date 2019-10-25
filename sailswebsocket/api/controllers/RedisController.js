var redis = require('redis');
var client = redis.createClient(6379,"localhost");
module.exports = {
    redis_test: function(req,res){
        client.on('error',function(err){
            return sails.log(err);
        })
        client.set('h',"hello");
        client.lpush('list',"java");
        client.lpush("list","js");
        client.lpush("list","golang");
        client.lpush("list","python");
        client.lpush("list","c++");
        client.get('h',function(err,data){
            if(err){
                sails.log(err);
            }
            if(data){
                console.log(data);
            }
        });

        client.lrange('list',0,4,function(err,data){
            if(err){
                sails.log(err);
            }
            if(data){
                res.json(data);
            }
        })
    }
}