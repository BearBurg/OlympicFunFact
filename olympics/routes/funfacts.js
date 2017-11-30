var express = require('express');
var router = express.Router();

var path = require('path');
// var bodyParser = require('body-parser');
//mongo db
var mongojs = require('mongojs');
var connectionString = "mongodb://cis550:cis550@cis550-shard-00-00-a0sk1.mongodb.net:27017,cis550-shard-00-01-a0sk1.mongodb.net:27017,cis550-shard-00-02-a0sk1.mongodb.net:27017/data?ssl=true&replicaSet=Cis550-shard-0&authSource=admin"
var db = mongojs(connectionString, ['olympics_new']);

//oracle db
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var dbConfigUser = {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  };



router.get('/', function(req,res,next){
  res.sendFile(path.join(__dirname, '../', 'views', 'funfacts.html'));
  
  // var name = req.query.name;

  // if (name != 'undefined') {
  // 	db.olympics_new.find({$or:[{Name: RegExp(name + ' ')}, {Name: RegExp(' ' + name)}]}, function(err,person) {
  // 		if (err){
  // 			res.send(err);
  // 		}
  // 		res.json(person);
  // 	});
  // }
	
});

router.get('/data',function(req,res,next){
  var top = req.query.top;
  console.log(top);
})



module.exports = router;
