// var list = [];
var moment = require('moment');
var uuid = require('node-uuid');
module.exports = {
	create_users: function (req, res) {
		var user_id = uuid.v4();
		var user_name = req.param('user_name');
		BaseService.exec_sql('insert into users(user_id,user_name) values(?,?)',[user_id,user_name]);
		res.json({
			user_id: user_id,
			user_name: user_name
		})
	},
	create_conv: function (req, res) {
		var create_user = req.param('user_id');
		var conv_id = 'conv_' + uuid.v4();
		var conv_name = req.param('conv_name');
		var create_at = moment().format('YYYY-MM-DD hh:mm:ss');
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
			if (data) {
				_.forEach(data, (data) => {
					if (user_id === data.user_id) {
						sails.sockets.join(req, user_id, function (err) {
							if (err) {
								console.log(err);
							}
						});
						sails.sockets.addRoomMembersToRooms(user_id, ['room']);
						SaveMessageService.exec_insert(conv_id, data.user_id, message);
						ConvMemberService.exec_insert()

					}

				});
				setInterval(() => {
					sails.sockets.broadcast(user_id, { message: '系统消息:' + new Date() });
				}, 1000 * 60 * 30);


			}
			sails.sockets.broadcast('room', { message: message });
			return res.json(socketId);
		});



	},
	client1: function (req, res) {
		res.view('client1');
	},
	client2: function (req, res) {
		res.view('client2');
	}
}