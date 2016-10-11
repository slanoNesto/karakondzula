var express = require('express');
var app = express();
var routes = require('./routes/routes')(app);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongooseSlug = require('mongoose-slug-generator');

mongoose.plugin(mongooseSlug);
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

var PORT = 3000;

//connect to mongoose
mongoose.connect('mongodb://localhost/karakondzula');
var db = mongoose.connection;

app.get('/', function(req, res) {
    res.send('odjebi');
});

app.listen(PORT);
console.log('Running on port: ' + PORT);