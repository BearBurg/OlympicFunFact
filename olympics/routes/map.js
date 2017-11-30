var express = require('express');
var router = express.Router();

// var path = require('path');
// var bodyParser = require('body-parser');

//oracle db
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var dbConfigUser = {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  };


router.get('/', function(req,res,next){
	// res.render('Olympics.html');

	var year = parseInt(req.query.year,10);
	var medal = req.query.medal;
	var sports = req.query.sports;

  console.log(medal);

  //year medal sports 
	if (year != 0 && !(medal === 'empty') && !(sports === 'empty')) {
		var sqlquery = " WITH T AS (SELECT EVENT_ID FROM EVENT WHERE SPORT = '" + sports + 
    "') SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM FROM (SELECT * FROM AWARD A WHERE A.year = " + year + 
    " and A.EVENT_ID IN (SELECT * FROM T) AND MEDAL = '" + medal + 
    "') GROUP BY NATIONALITY ORDER BY NUM DESC ";
    console.log(sqlquery);
	  sqlConnection(req,res,sqlquery);
  } 
  //medal sports
  else if (year == 0 && !(medal === 'empty') && !(sports === 'empty')) {
    var sqlquery = "WITH T AS ( " + 
                    "SELECT EVENT_ID " + 
                    "FROM EVENT " + 
                    "WHERE SPORT = '" + sports + "') " +
                    "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM ( SELECT * " +
                    "FROM AWARD A " +
                    "WHERE A.EVENT_ID IN (SELECT * FROM T) AND MEDAL = '" + medal +
                    "') " +
                    "GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  } 
  //sports
  else if (year == 0 && medal === 'empty' && !(sports === 'empty')) {
    var sqlquery = "WITH T AS ( " + 
                    "SELECT EVENT_ID " + 
                    "FROM EVENT " + 
                    "WHERE SPORT = '" + sports + "') " +
                    "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM ( SELECT * " +
                    "FROM AWARD A " +
                    "WHERE A.EVENT_ID IN (SELECT * FROM T) " +
                    "ORDER BY A.EVENT_ID) " +
                    " GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC "
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);

  }
  //all default
  else if (year == 0 && medal === 'empty' && sports === 'empty') {
    var sqlquery = "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM AWARD A " +
                    "GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);


  }
  //medal
  else if (year == 0 && !(medal === 'empty') && sports === 'empty'){
    var sqlquery = "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM ( SELECT * " +
                    "FROM AWARD A " +
                    "WHERE MEDAL = '" + medal +
                    "') " +
                    "GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  //year medal
  else if (year != 0 && !(medal === 'empty') && sports === 'empty'){
    var sqlquery = "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM ( SELECT * " +
                    "FROM AWARD A " +
                    "WHERE MEDAL = '" + medal +
                    "' AND YEAR = "+ year + ") " +
                    "GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  //year sports
  else if (year != 0 && medal === 'empty' && !(sports === 'empty')){
    var sqlquery = "WITH T AS ( " + 
                    "SELECT EVENT_ID " + 
                    "FROM EVENT " + 
                    "WHERE SPORT = '" + sports + "') " +
                    "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM ( SELECT * " +
                    "FROM AWARD A " +
                    "WHERE A.EVENT_ID IN (SELECT * FROM T) " +
                    "AND YEAR = "+ year +") " +
                    " GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC "
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  //year
  else if (year != 0 && medal === 'empty' && sports === 'empty'){
    var sqlquery = "SELECT NATIONALITY, count(distinct EVENT_ID) AS NUM " +
                    "FROM ( SELECT * " +
                    "FROM AWARD A " +
                    "WHERE YEAR = "+ year +") " +
                    " GROUP BY NATIONALITY " +
                    "ORDER BY NUM DESC "
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  
});

var sqlConnection = function(req,res,sqlquery){
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
          doRelease(connection);
          return;
        }
        res.json(result.rows);
        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        console.log(result.rows);     // [ [ 180, 'Construction' ] ]
        doRelease(connection);
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




module.exports = router;
