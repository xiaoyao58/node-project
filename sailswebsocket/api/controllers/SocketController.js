module.exports = {
    socketTest: function (req, res) {
		
		var message = req.param('message');
	
		var socketId = sails.sockets.getId(req);

		if (!req.isSocket) {
			return res.badRequest();
		}

		sails.sockets.join(req,'room',function(err){
			if(err){
				console.log(err);
			}
		});

			sails.sockets.broadcast('room',{message:message});
			
		sails.log("socket ID is" + socketId);
		return res.json(socketId);


	},
	client1: function(req,res){
		res.view('client1');
	},
	client2:function(req,res){
		res.view('client2');
	}
}