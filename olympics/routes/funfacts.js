var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');  
var app = express(); 
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

// var path = require('path');
// var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var connectionString = "mongodb://cis550:cis550@cis550-shard-00-00-a0sk1.mongodb.net:27017,cis550-shard-00-01-a0sk1.mongodb.net:27017,cis550-shard-00-02-a0sk1.mongodb.net:27017/data?ssl=true&replicaSet=Cis550-shard-0&authSource=admin"
var db = mongojs(connectionString, ['olympics_new']);

// var oracledb = require('oracledb');
// var dbConfig = require('./dbconfig.js');
// var dbConfigUser = {
//     user          : dbConfig.user,
//     password      : dbConfig.password,
//     connectString : dbConfig.connectString
//   };


router.get('/', function(req,res,next){
	// res.send("funfacts");
	res.render('funfacts.html');
	// console.log("hi");

});

router.post('/', function(req, res, next) {

	var name = req.body.name;
	name = name.replace(" ","_");
	console.log(name);
	db.olympics_new.find({$or:[{Name: RegExp(name + ' ')}, {Name: RegExp(' ' + name)}]}, {"_id":0},function(err,person) {
    if (err){
     res.send(err);
    }
    console.log(person.length);
    res.json(person);

   });

	});



// router.get('/countryInfo', function(req,res,next) {
// 	var year = req.query.year;
// 	var medal = req.query.medal;
// 	var sports = req.query.sports;
// 	console.log(year);
// 	console.log(medal);
// 	// var discipline = req.query.discipline;
// 	// var gender = req.query.gender;
// 	// var season = req.query.season;
// 	// var top = req.query.top;

//  //   var sqlquery = "WITH T AS (" +
// 	// "SELECT EVENT_ID " +
// 	// "FROM EVENT " +
// 	// "WHERE SPORT = \'Swimming\') " + 
// 	// "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
// 	// "FROM ( " +
// 	// "SELECT * " +
// 	// "FROM AWARD A " +
// 	// "WHERE A.year = "+ "2016 " + "and A.EVENT_ID IN (SELECT * FROM T)" +
// 	// "ORDER BY A.EVENT_ID) " +
// 	// "WHERE MEDAL = " + "\'GOLD\'' " + 
// 	// "GROUP BY NATIONALITY " +
// 	// "ORDER BY NUM DESC";
// 	// var sqlquery = "SELECT * " + "FROM EVENT " + "WHERE SPORT = \'Swimming\'";
// 	var sqlquery = " WITH T AS (SELECT EVENT_ID FROM EVENT WHERE SPORT = \'Swimming\') SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM FROM (SELECT * FROM AWARD A WHERE A.year = 2016 and A.EVENT_ID IN (SELECT * FROM T) ORDER BY A.EVENT_ID) WHERE MEDAL = \'GOLD\' GROUP BY NATIONALITY ORDER BY NUM DESC ";
//   	sqlConnection(req,res,sqlquery);

	

// });

// var sqlConnection = function(req,res,sqlquery){
//   oracledb.getConnection(dbConfigUser, function(err, connection) {
//     if (err) {
//       console.error(err.message);
//       return;
//     }
//     connection.execute(
//       sqlquery,
//       // The "bind value" 180 for the "bind variable" :id
//       [],

//       // Optional execute options argument, such as the query result format
//       // or whether to get extra metadata
//       // { outFormat: oracledb.OBJECT, extendedMetaData: true },

//       // The callback function handles the SQL execution results
//       function(err, result)
//       {
//         if (err) {
//           console.error(err.message);
//           doRelease(connection);
//           return;
//         }
//         res.json(result.rows);
//         console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
//         console.log(result.rows);     // [ [ 180, 'Construction' ] ]
//         doRelease(connection);
//       });
//   });

// }

// function doRelease(connection)
// {
//   connection.close(
//     function(err) {
//       if (err) {
//         console.error(err.message);
//       }
//     });
// }

// router.get('/athleteInfo', function(req,res,next) {
//   var top = req.query.top;
//   var medal = req.query.medal;
//   var sports = req.query.sports;
//   var discipline = req.query.discipline;
//   var gender = req.query.gender;
//   var season = req.query.season;

//   res.send(top);

	
// });



module.exports = router;
