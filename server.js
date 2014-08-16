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

