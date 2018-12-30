var path = require('path'), express = require('express');
var qs = require('querystring');
var app = express();
app.use('/ui5', express.static(path.join(__dirname, 'webapp')));
app.use(express.favicon());

app.get('/', function(req, res){
	console.log("method in get/: " + req.method);    
   	res.send("It works!");
});


app.listen(process.env.PORT || 3000, function(){
     console.log("connect to localhost:3000");
});