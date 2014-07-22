//server.js

var express = require('express');
var app = express();

//configuration

// app.configure(function(){
// 	app.use(express.static(__dirname + '/public'));
// 	app.use(express.logger('dev'));
// 	app.use(express.bodyParser());
// });
app.get('/', function (req, res) {
  res.send('Hello from the robots')
})

app.get('/api/command', function(req,res){
	//send command to rabbitmq
});

//listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");

