
if( process.argv.length < 3 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js <secret> [<stream-port> <websocket-port>]'
	);
	process.exit();
}

var STREAM_SECRET = process.argv[2],
	STREAM_PORT = process.argv[3] || 8082,
	WEBSOCKET_PORT = process.argv[4] || 8084,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 320,
	height = 240;

// Websocket Server
var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		if (this.clients[i].readyState == 1) {
			this.clients[i].send(data, opts);
		}
		else {
			console.log( 'Error: Client ('+i+') not connected.' );
		}
	}
};


// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');
	width = (params[1] || 320)|0;
	height = (params[2] || 240)|0;

	if( params[0] == STREAM_SECRET ) {
		console.log(
			'Stream Connected: ' + request.socket.remoteAddress + 
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + 
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}).listen(STREAM_PORT);

console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');

//server.js

var express = require('express');
var app = express();
var moment = require('moment');
var RobotQueue = require('./robotqueue');

//var config = require('./config')

app.use(express.static(__dirname + '/public')); 


app.get('/', function (req, res) {
  res.send('Hello from the robots')
});

app.get('/video/videoonly', function(req, res){
	console.log('/video/videoonly');

	
});

//example ~/api/command?command=turn%20100%201
app.get('/api/command', function(req,res){
	//send command to rabbitmq

	console.log('in api/command');
	console.log(JSON.stringify(req.query));

	if(req && req.query && req.query.command){
		var command = req.query.command;
		console.log(req.query.command);
		var q = 'tilt';
		var url = process.env.AMQP_CONN;

		console.log("connecting to... " + url);
		if(RobotQueue.connection === 'empty'){
			RobotQueue.connection = require('amqplib').connect(url);
			console.log('creating connection to queue');
		}else{
			console.log('found connection to queue');
		}


		RobotQueue.connection.then(function(conn) {
		  var ok = conn.createConfirmChannel();
		  ok = ok.then(function(ch) {
		    ch.assertQueue(q);
		    ch.on

			console.log('debug 1:  ' + moment().format());

					console.log('debug 2:  ' + moment().format());
					ch.sendToQueue(q, new Buffer(command), {type : 'tilt'}, function(err, ok) {
							console.log('debug 3:  ' + moment().format());
			            if (err !== null){
			               console.log('Message nacked!:  ' + moment().format());
			            }else{
			               console.log('Message acked:  ' + moment().format());
			            }
					});

			});
				console.log('debug 5:  ' + moment().format());
		  return ok;
		}).then(null, console.warn);
	}else{
		console.log('could not parse input.');
	}

	res.send('waiting for command.')
});


//listen (start app with node server.js)
var port = process.env.PORT || 3000;
app.listen(port);
console.log("App listening on port " + port);


