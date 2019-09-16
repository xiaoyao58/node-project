// var socket = require('socket.io-client')('http:localhost:1339/leave/socketTest')
// // var io = require('sails.io.js')(require('socket.io-client'));
// module.exports = {
//     client: function (req, res) {
//         console.log('come');
//         // io.socket.get('http:localhost:1339/leave/socketTest',function(resDaata){
//         //     console.log(resDaata);
//         // })
//         socket.on('room',function(data){
//             console.log(data.name)
//         })
//     }
// }


// var socketIOClient = require('socket.io-client');
// var sailsIOClient = require('sails.io.js');

// Instantiate the socket client (`io`)
// (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
// var io = sailsIOClient(socketIOClient);

// Set some options:
// (you have to specify the host and port of the Sails backend when using this library from Node.js)
// io.sails.url = 'http://localhost:1339';
// ...

// Send a GET request to `http://localhost:1337/hello`:
// io.socket.get('/leave/socketTest', function serverResponded (body, JWR) {
//   // body === JWR.body
//   console.log('Sails responded with: ', body);
//   console.log('with headers: ', JWR.headers);
//   console.log('and with status code: ', JWR.statusCode);

//   // ...
//   // more stuff
//   // ...


//   // When you are finished with `io.socket`, or any other sockets you connect manually,
//   // you should make sure and disconnect them, e.g.:
// //   io.socket.disconnect();

//   // (note that there is no callback argument to the `.disconnect` method)
// });

// var socketIOClient = require('socket.io-client');
// var sailsIOClient = require('sails.io.js');

// var io = sailsIOClient(socketIOClient);
// io.sails.url = 'http://localhost:1337';
// // io.socket.get('/socket/socketTest',{hello:'hello'});
// io.socket.post('/socket/socketTest',{message:'message'});
// io.socket.on('message', (data) => {
//     if(!_.isEmpty(data)){
//         console.log(data);
//     }
// });





