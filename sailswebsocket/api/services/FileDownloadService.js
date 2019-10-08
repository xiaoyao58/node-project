module.exports = {
    file_download: function(filePath,filename,callback){
        var stream = fs.createReadStream(filePath);
        var stats = fs.statSync(filePath);
        if(stats.isFile()){
            if(callback){
                return callback(null,{
                    ContentType:'image/jpeg',
                    ContentDisposition:'attachment;filename='+filename,
                    ContentLength:stats.size
                });
            }
            res.set({
                
            });
            stream.pipe(res);
        }else{
            return callback({
                error: 404
            });
        }
    }
}