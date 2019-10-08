module.exports = {
    file_download: function(req,res){
        var filePath = 'assets/images/4a06f622-028a-4323-97ef-a58326006f88.jpeg';
        var stream = fs.createReadStream(filePath);
        var stats = fs.statSync(filePath);
        if(stats.isFile()){
            res.set({
                'Content-Type':'image/jpeg',
                'Content-Disposition':'attachment;filename=new.jpeg',
                'Content-Length':stats.size
            });
            stream.pipe(res);
        }else{
            res.end(404);
        }
    }
}