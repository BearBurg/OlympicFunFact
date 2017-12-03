var express = require('express');
var router = express.Router();

// var path = require('path');
// var bodyParser = require('body-parser');


router.get('/', function(req,res,next){
	res.render('entry.html');
})


module.exports = router;
