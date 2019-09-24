
var moment = require('moment');
var uuid = require('node-uuid');
module.exports = {
	create_users: function (req, res) {
		var user_id = uuid.v4();
		var user_name = req.param('user_name');
		BaseService.exec_sql('insert into users(user_id,user_name) values(?,?)', [user_id, user_name]);
		res.json({
			user_id: user_id,
			user_name: user_name
		})
	},
	create_conv: function (req, res) {

		var create_user = req.param('user_id');
		var conv_id = 'conv_' + uuid.v4();
		var conv_name = req.param('conv_name');
		var create_at = '';
		var create_at = new Date();
		BaseService.exec_sql('insert into conv(conv_id,conv_name,create_user,create_at) values(?,?,?,?)', [conv_id, conv_name, create_user, create_at]);
		res.json({
			create_user: create_user,
			conv_id: conv_id,
			conv_name: conv_name,
			create_at: create_at,
		})
	},
	socketTest: function (req, res) {
		var send = {};
		send.list = [];
		var user_id = req.param('user_id');
		var message = req.param('message');
		var socketId = sails.sockets.getId(req);
		var conv_id = req.param('conv_id');

		if (!req.isSocket) {
			return res.badRequest();
		}
		console.log('socketId:' + socketId);
		console.log('message:' + message);

		BaseService.exec_sql('select * from users', (err, data) => {
			if (err) {
				sails.log(err);
				return 0;
			}
			if (data && !_.isEmpty(data)) {
				_.forEach(data, (data) => {
					if (user_id === data.user_id) {
						sails.sockets.join(req, user_id, function (err) {
							if (err) {
								console.log(err);
							}
						});
						sails.sockets.addRoomMembersToRooms(user_id, ['room']);
						SaveMessageService.exec_insert(conv_id, data.user_id, message, () => {
							BaseService.exec_sql('select * from conv_msg where conv_id =? order by create_at asc', [conv_id], (err, data) => {
								if (data && !_.isEmpty(data)) {
									_.forEach(data, (data) => {
										var msg = {};
										msg.msg = data.msg;
										msg.create_at = moment(data.create_at).format('YYYY-MM-DD HH:mm:ss');
										msg.conv_id = data.conv_id;
										msg.from_user = data.from_user;
										send.list.push(msg);
									});
									sails.sockets.broadcast('room', send);
								}
							});
						});
					}

				});
				// setInterval(() => {
				// 	sails.sockets.broadcast(user_id, { message: '系统消息:' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });
				// }, 1000 * 60 * 1);
			}



			return res.json(socketId);
		});



	},
	getfile: function(req,res){
		
	},

	upload: function(req,res){
		var user_id = req.param('user_id');
		var fileName = uuid.v4();
		const maxBytes = 1024*1024*100;
		const file_path = '../../assets/images';
		var file = req.file('file');
		var name = file._files[0].stream.filename;
		var ext = name.substring(name.lastIndexOf('.'));
		file.upload({
			maxBytes: maxBytes,
			dirname: file_path+'/',
			saveAs: fileName+ext
		},function(err,uploadFile){
			if(err){
				sails.log(err);
				return 0;
			}
			if(uploadFile){
				console.log(uploadFile);
			}
		});
		BaseService.exec_sql('select user_name from users where user_id = ?',[user_id],(err,data)=>{
			if(err){
				return req.badRequest();
			}
			if(data&&!_.isEmpty(data)){
				BaseService.exec_sql('insert into conv_file(file_id,conv_id,create_user,file_name,file_path,type,create_at) values(?,?,?,?,?,?,?)',[fileName,])
			}
		});

	},
	client1: function (req, res) {
		res.view('client1');
	},
	client2: function (req, res) {
		res.view('client2');
	}
}