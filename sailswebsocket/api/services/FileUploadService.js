module.exports = {
    file_upload: function (MAXBYTES, FILE_PATH,fileName,file,callback) {

		//判断上传文件是否为空
		if (!file._files[0]) {//file._files[0]表示上传的第一个文件，1表示第二个文件，依此类推
			return callback({
				errcode: 1,
				errdesc: '请选择附件后再上传'
			});
		}
		var name = file._files[0].stream.filename;//获取上传文件的名称，如dhviso.jpg
		let ext = name.substring(name.lastIndexOf("."));//获取文件后缀名,如.jpg
		file.upload({//文件上传 upload({上传文件的存放信息},callback())  或者req.file('file').upload({},callback())
			maxBytes: MAXBYTES,
			dirname: FILE_PATH + '/',//上传的位置
			saveAs: fileName + ext//上传后文件的名称
		}, function whenDone(err, uploadedFiles) {//uploadedFiles为上传文件的信息
			if (err) {
				if(callback){
					return callback(err);
				}
			}
			if(callback){
				return callback(null,{
						errcode: 0,
						errdesc: "文件上传成功",
						uploadedFiles: uploadedFiles
					});
			}
		});
	}
}