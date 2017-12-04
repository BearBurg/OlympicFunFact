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
		var sqlquery =  "WITH S AS ( " +
                    "SELECT EVENT_ID " +
                    "FROM EVENT " +
                    "WHERE SPORT = '" + sports + "'), " +
                    " T AS ( " +
                    " SELECT YEAR, A.NATIONALITY, A.EVENT_ID, A.MEDAL " +
                    " FROM AWARD A " +
                    " WHERE A.EVENT_ID IN (SELECT * FROM S) AND A.MEDAL = '" + medal + "' AND A.YEAR = '" + year + "' " +
                    " GROUP BY A.NATIONALITY, A.EVENT_ID, A.MEDAL, A.YEAR) " +
                    " SELECT Nationality, COUNT(MEDAL) AS NUM " +
                    " FROM T " +
                    " GROUP BY NATIONALITY " +
                    " ORDER BY NUM DESC ";
    console.log(sqlquery);
	  sqlConnection(req,res,sqlquery);
  } 
  //medal sports
  else if (year == 0 && !(medal === 'empty') && !(sports === 'empty')) {
    var sqlquery =  "WITH S AS ( " +
                    "SELECT EVENT_ID " +
                    "FROM EVENT " +
                    "WHERE SPORT = '" + sports + "'), " +
                    " T AS ( " +
                    " SELECT YEAR, A.NATIONALITY, A.EVENT_ID, A.MEDAL " +
                    " FROM AWARD A " +
                    " WHERE A.EVENT_ID IN (SELECT * FROM S) AND A.MEDAL = '" + medal + "' " +
                    " GROUP BY A.NATIONALITY, A.EVENT_ID, A.MEDAL, A.YEAR) " +
                    " SELECT Nationality, COUNT(MEDAL) AS NUM " +
                    " FROM T " +
                    " GROUP BY NATIONALITY " +
                    " ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  } 
  //sports
  else if (year == 0 && medal === 'empty' && !(sports === 'empty')) {
    var sqlquery =  "WITH S AS ( " +
                    "SELECT EVENT_ID " +
                    "FROM EVENT " +
                    "WHERE SPORT = '" + sports + "'), " +
                    " T AS ( " +
                    " SELECT YEAR, A.NATIONALITY, A.EVENT_ID, A.MEDAL " +
                    " FROM AWARD A " +
                    " WHERE A.EVENT_ID IN (SELECT * FROM S) " +
                    " GROUP BY A.NATIONALITY, A.EVENT_ID, A.MEDAL, A.YEAR) " +
                    " SELECT Nationality, COUNT(MEDAL) AS NUM " +
                    " FROM T " +
                    " GROUP BY NATIONALITY " +
                    " ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);

  }
  //all default
  else if (year == 0 && medal === 'empty' && sports === 'empty') {
    var sqlquery =  "WITH Summation AS ( " +
                    "SELECT P.NOC, SUM(P.TOTAL) AS SUM " +
                    "FROM PARTICIPATE P " +
                    "GROUP BY P.NOC) " +
                    "SELECT C.Nation, Summation.SUM " +
                    "FROM Summation NATURAL JOIN COUNTRY C " +
                    "ORDER BY Summation.SUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);


  }
  //medal
  else if (year == 0 && !(medal === 'empty') && sports === 'empty'){
    var sqlquery =  "WITH Summation AS ( " +
                    "SELECT P.NOC, SUM(P." + medal + ") AS SUM " +
                    "FROM PARTICIPATE P " +
                    "GROUP BY P.NOC) " +
                    "SELECT C.Nation, Summation.SUM " +
                    "FROM Summation NATURAL JOIN COUNTRY C " +
                    "ORDER BY Summation.SUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  //year medal
  else if (year != 0 && !(medal === 'empty') && sports === 'empty'){
    var sqlquery =  "SELECT C.NATION, P." + medal + " " +
                    "FROM PARTICIPATE P NATURAL JOIN COUNTRY C " +
                    "WHERE P.YEAR = '" + year + "' " +
                    "ORDER BY P." + medal + " DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  //year sports
  else if (year != 0 && medal === 'empty' && !(sports === 'empty')){
    var sqlquery =  "WITH S AS ( " +
                    "SELECT EVENT_ID " +
                    "FROM EVENT " +
                    "WHERE SPORT = '" + sports + "'), " +
                    " T AS ( " +
                    " SELECT YEAR, A.NATIONALITY, A.EVENT_ID, A.MEDAL " +
                    " FROM AWARD A " +
                    " WHERE A.EVENT_ID IN (SELECT * FROM S) AND A.YEAR = '" + year + "' " +
                    " GROUP BY A.NATIONALITY, A.EVENT_ID, A.MEDAL, A.YEAR) " +
                    " SELECT Nationality, COUNT(MEDAL) AS NUM " +
                    " FROM T " +
                    " GROUP BY NATIONALITY " +
                    " ORDER BY NUM DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  //year
  else if (year != 0 && medal === 'empty' && sports === 'empty'){
    var sqlquery =  "SELECT C.NATION, P.TOTAL " +
                    "FROM PARTICIPATE P NATURAL JOIN COUNTRY C " +
                    "WHERE P.YEAR = '" + year + "' " +
                    "ORDER BY P.TOTAL DESC ";
    console.log(sqlquery);
    sqlConnection(req,res,sqlquery);
  }
  
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




module.exports = router;
