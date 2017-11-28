var express = require('express');
var router = express.Router();

// var path = require('path');
// var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var connectionString = "mongodb://cis550:cis550@cis550-shard-00-00-a0sk1.mongodb.net:27017,cis550-shard-00-01-a0sk1.mongodb.net:27017,cis550-shard-00-02-a0sk1.mongodb.net:27017/data?ssl=true&replicaSet=Cis550-shard-0&authSource=admin"
var db = mongojs(connectionString, ['olympics_new']);

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var dbConfigUser = {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  };


router.get('/', function(req,res,next){
	// res.send("funfacts");
	res.render('funfacts.html');

})

router.get('/test/:id', function(req,res,next){
	db.olympics_new.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err,person) {
		if (err){
			res.send(err);
		}
		res.json(person);
	});
	
});

router.get('/countryInfo', function(req,res,next) {
	// res.send("sql");
	// var top = req.params.top;
	// var medal = req.params.medal;
	// var sports = req.params.sports;
	// var discipline = req.params.discipline;
	// var gender = req.params.gender;
	// var season = req.params.season;

  var sqlquery = "SELECT * " + "FROM  award";
  sqlConnection(req,res,next,sqlquery);

	

});

var sqlConnection = function(req,res,next,sqlquery){
  oracledb.getConnection(dbConfigUser, function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      sqlquery,
      // The "bind value" 180 for the "bind variable" :id
      [],

      // Optional execute options argument, such as the query result format
      // or whether to get extra metadata
      // { outFormat: oracledb.OBJECT, extendedMetaData: true },

      // The callback function handles the SQL execution results
      function(err, result)
      {
        if (err) {
          console.error(err.message);
          connection.close(
            function(err) {
              if (err) {
                console.error(err.message);
              }
          });
          return;
        }
        res.json(result);
        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        console.log(result.rows);     // [ [ 180, 'Construction' ] ]
        connection.close(
          function(err) {
            if (err) {
              console.error(err.message);
            }
        });
      });
  });

}



router.get('/athleteInfo', function(req,res,next) {
	var top = req.params.top;
	var medal = req.params.medal;
	var sports = req.params.sports;
	var discipline = req.params.discipline;
	var gender = req.params.gender;
	var season = req.params.season;

	
});



module.exports = router;
