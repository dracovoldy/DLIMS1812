var path = require('path'), express = require('express');
var favicon = require('serve-favicon');
var qs = require('querystring');
var app = express();
app.use('/dev', express.static(path.join(__dirname, 'webapp')));
app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(favicon(__dirname + '/webapp/favicon.ico'));

// app.get('/', function(req, res){
// 	console.log("method in get/: " + req.method);    
//    	res.send("It works!");
// });

let PORT = 80;

app.listen(process.env.PORT || PORT, function(){
     console.log(`connect to localhost:${PORT}`);
});