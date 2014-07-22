//server.js

var express = require('express');
var app = express();
var moment = require('moment');
var config = require('./config')


app.get('/', function (req, res) {
  res.send('Hello from the robots')
})

app.get('/api/command', function(req,res){
	//send command to rabbitmq

	var command = req.query.command;
	console.log(req.query.command);
	var q = 'tilt2';
	var url = config.amqp.url;

	console.log("connecting to... " + url);
	var open = require('amqplib').connect(url);

	open.then(function(conn) {
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

	res.send('waiting for command.')
});


//listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");

