var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var map = require('./routes/map');
var funfacts = require('./routes/funfacts');

var app = express();

var port = 8024;

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

/* GET home page. */
app.use('/', index);
app.use('/map', map);
app.use('/funfacts', funfacts);

app.listen(port, function(){
	console.log('Server started on port ' + port);
})

