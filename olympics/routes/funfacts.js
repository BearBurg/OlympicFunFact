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
	// console.log("hi");

});

router.post('/info', function(req, res, next) {
	var name = req.body.name;
	console.log("name: " + name);
	var nameList = name.trim().split(" ");
  if (nameList.length == 2) {
    var name1 = nameList[0] ;
    var name2 = nameList[1] ;
    console.log("name1: "+name1);
    console.log("name2: "+name2)
    db.olympics_new.find({$and: [{ Name : {'$regex' : name1, '$options' : 'i'}}, { Name : {'$regex' : name2, '$options' : 'i'} } ]}, {"_id":0},function(err,person) {
      if (err){
       res.send(err);
      }
      console.log(person.length);
      res.json(person);

   });

  } else if (nameList.length == 1) {
    var name1 = nameList[0] ;
    db.olympics_new.find({ Name : {'$regex' : name1, '$options' : 'i'}}, {"_id":0},function(err,person) {
      if (err){
       res.send(err);
      }
      console.log(person.length);
      res.json(person);

   });
  }
	
});



router.post('/awards', function(req,res,next) {
	var firstName = req.body.firstNameAward;
  var lastName = req.body.lastNameAward;
  var name1 = firstName + " " + lastName;
  var name2 = lastName + " " + firstName;

  name1 = titleCase(name1);
  name2 = titleCase(name2);

	var sqlquery = "with T1 as (SELECT athlete_id as id, name " +
					"FROM athlete " +
					"where name = '"+ name1 +"' or name = '" + name2 + "'), " +
					"T2 as (select athlete_id as id, year,medal,event, season, sport " +
					"from award a natural join event e " + 
					"where a.athlete_id in (select athlete_id from T1)), " +
          "T3 as (select T2.id, o.year, sport, event, city, T2.season, medal " +
          "from T2 inner join olympics o on T2.year=o.year and T2.season = o.season) " +
					"SELECT T1.name, T3.year, T3.sport, T3.event, T3.city, T3.season, T3.medal " +
					"FROM T3 join T1 on T3.id = T1.id order by T3.year";

	console.log(sqlquery);

  sqlConnection(req,res,sqlquery);

	

});

router.get('/test', function(req, res, next) {
	var result =[[2000,"Springboard","Sydney","Summer","SILVER"],[2000,"Synchronised Springboard","Sydney","Summer","SILVER"],[2004,"Springboard","Athens","Summer","GOLD"],[2004,"Synchronised Springboard","Athens","Summer","GOLD"],[2008,"Springboard","Beijing","Summer","GOLD"],[2008,"Synchronised Springboard","Beijing","Summer","GOLD"]];

	res.json(result);

});



var sqlConnection = function(req,res,sqlquery){
  oracledb.getConnection(dbConfigUser, function(err, connection) {
    if (err) {
      console.error(err.message);
      doRelease(connection);
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
          doRelease(connection);
          return;
        }
        res.json(result.rows);
        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        console.log(result.rows);     // [ [ 180, 'Construction' ] ]
        doRelease(connection);
        return;
      });
  });

}

function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}

function titleCase(str) {
    return str.toLowerCase()
      .split(" ")
      .map(function(v){return v.charAt(0).toUpperCase() + v.slice(1)})
      .join(" ");
}





module.exports = router;
