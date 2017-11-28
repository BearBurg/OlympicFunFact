var express = require('express');
var router = express.Router();

// var path = require('path');
// var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var connectionString = "mongodb://cis550:cis550@cis550-shard-00-00-a0sk1.mongodb.net:27017,cis550-shard-00-01-a0sk1.mongodb.net:27017,cis550-shard-00-02-a0sk1.mongodb.net:27017/data?ssl=true&replicaSet=Cis550-shard-0&authSource=admin"
var db = mongojs(connectionString, ['olympics_new']);


router.get('/', function(req,res,next){
	res.send("funfacts");
})

router.get('/test/:id', function(req,res,next){
	db.olympics_new.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err,person) {
		if (err){
			res.send(err);
		}
		res.json(person);
	});
	
});



module.exports = router;
