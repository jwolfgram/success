var express = require('express'),
path = require('path'),
app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/html/login.html'));
});

app.use('/style',express.static('public/css')); //Route to /style for css
app.use('/js',express.static('public/js')); //Route to /js for javascript
app.use('/angular', express.static('node_modules/angular-route/'));

app.listen(8080);