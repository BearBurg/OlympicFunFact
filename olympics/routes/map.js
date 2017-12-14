var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var dbConfigUser = {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  };


router.get('/', function(req,res,next){
	res.render('Olympics.html');
	//console.log(req);
	// var year = req.query.year;
	// var medal = req.body.medal;
	// console.log(year);
	// console.log(medal);

});

var year;
var medal;
var sports;
var gender;

//var fake = [["UnitedStates",1],["Australia",3],["Hungary",3],["France",2],["Netherlands",2],["UnitedKingdom",1],["China",1],["Sweden",1],["Italy",1],["Denmark",1],["Kazakhstan",33],["Spain",1],["Singapore",333]];



router.post('/', function(req, res, next) {
	  	console.log(req.body);
		 year = req.body.yearData;
		 medal = req.body.medalData;
	     sports = req.body.sportData;
	     gender = req.body.genderData;
	     console.log("sports " + sports);
	     console.log("year" + year);
	     console.log("medal" + medal);



	      //year medal sports 
			if (year != 0 && !(medal === 'empty') && !(sports === 'empty')) {
				var sqlquery =  "WITH SE AS ( " +
		                    "SELECT EVENT_ID " +
		                    "FROM EVENT " +
		                    "WHERE SPORT = '" + sports + "'), " +
		                    "AW AS( SELECT * " +
		                    "FROM AWARD " +
		                    "WHERE EVENT_ID IN (SELECT EVENT_ID FROM SE) AND MEDAL = '" + medal + "' AND YEAR = '" + year + "'), " +
		                    "SA AS ( " +
		                    "SELECT A1.YEAR, A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL " +
		                    "FROM AW A1 JOIN ATHLETE A2 ON A2.ATHLETE_ID = A1.ATHLETE_ID " +
		                    "GROUP BY A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL, A1.YEAR)," +
		                    "FINAL AS (SELECT Nationality, COUNT(MEDAL) AS TOTAL " +
		                    "FROM SA " +
		                    "GROUP BY NATIONALITY) " +
		                    "SELECT C.NATION_C, SUM(F.TOTAL) AS TOTAL " +
		                    "FROM FINAL F JOIN COUNTRY C ON F.NATIONALITY = C.NATION " +
				   			"GROUP BY Nation_C " +
		                    "ORDER BY TOTAL DESC ";
		    console.log(sqlquery);
			  sqlConnection(req,res,sqlquery);
		  } 
		  //medal sports
		  else if (year == 0 && !(medal === 'empty') && !(sports === 'empty')) {
		    var sqlquery =  "WITH SE AS ( " +
		                    "SELECT EVENT_ID " +
		                    "FROM EVENT " +
		                    "WHERE SPORT = '" + sports + "'), " +
		                    "SA AS ( " +
		                    "SELECT A1.YEAR, A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL " +
		                    "FROM ATHLETE A2 JOIN AWARD A1 ON A2.ATHLETE_ID = A1.ATHLETE_ID " +
		                    "WHERE A1.EVENT_ID IN (SELECT EVENT_ID FROM SE) AND A1.MEDAL = '" + medal + "' " +
		                    "GROUP BY A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL, A1.YEAR)," +
		                    "FINAL AS (SELECT Nationality, COUNT(MEDAL) AS TOTAL " +
		                    "FROM SA " +
		                    "GROUP BY NATIONALITY) " +
		                    "SELECT C.NATION_C, SUM(F.TOTAL) AS TOTAL " +
		                    "FROM FINAL F JOIN COUNTRY C ON F.NATIONALITY = C.NATION " +
				    		"GROUP BY Nation_C " +
		                    "ORDER BY TOTAL DESC ";
		    console.log(sqlquery);
		    sqlConnection(req,res,sqlquery);
		  } 

		  //sports
		  else if (year == 0 && medal === 'empty' && !(sports === 'empty')) {
		    var sqlquery =  "WITH SE AS ( " +
		                    "SELECT EVENT_ID " +
		                    "FROM EVENT " +
		                    "WHERE SPORT = '" + sports + "'), " +
		                    "SA AS ( " +
		                    "SELECT A1.YEAR, A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL " +
		                    "FROM ATHLETE A2 JOIN AWARD A1 ON A2.ATHLETE_ID = A1.ATHLETE_ID " +
		                    "WHERE A1.EVENT_ID IN (SELECT EVENT_ID FROM SE) " +
		                    "GROUP BY A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL, A1.YEAR)," +
		                    "FINAL AS (SELECT Nationality, COUNT(MEDAL) AS TOTAL " +
		                    "FROM SA " +
		                    "GROUP BY NATIONALITY) " +
				    "SELECT C.NATION_C, SUM(F.TOTAL) AS TOTAL " +
		                    "FROM FINAL F JOIN COUNTRY C ON F.NATIONALITY = C.NATION " +
				    "GROUP BY Nation_C " +
		                    "ORDER BY TOTAL DESC ";            
		    console.log(sqlquery);
		    sqlConnection(req,res,sqlquery);

		  }
		  //all default
		  else if (year == 0 && medal === 'empty' && sports === 'empty') {
		    var sqlquery =  "WITH Summation AS ( " +
		                    "SELECT P.NOC, SUM(P.TOTAL) AS SUM " +
		                    "FROM PARTICIPATE P " +
		                    "GROUP BY P.NOC), " +
		                    "Summation2 AS ( " +
		                    "SELECT C.Nation_C, Summation.SUM AS SUM1 " +
		                    "FROM COUNTRY C NATURAL JOIN Summation) " +
		                    "SELECT Nation_C, SUM(SUM1) AS TOTAL_MEDAL " +
		                    "FROM Summation2 " +
		                    "GROUP BY Nation_C " +
		                    "ORDER BY TOTAL_MEDAL DESC ";
		    console.log(sqlquery);
		    sqlConnection(req,res,sqlquery);


		  }
		  //medal
		  else if (year == 0 && !(medal === 'empty') && sports === 'empty'){
		    var sqlquery =  "WITH Summation AS ( " +
		                    "SELECT P.NOC, SUM(P." + medal + ") AS SUM " +
		                    "FROM PARTICIPATE P " +
		                    "GROUP BY P.NOC), " +
		                    "Summation2 AS ( " +
		                    "SELECT C.Nation_C, Summation.SUM AS SUM1 " +
		                    "FROM COUNTRY C NATURAL JOIN Summation) " +
		                    "SELECT Nation_C, SUM(SUM1) AS TOTAL_MEDAL " +
		                    "FROM Summation2 " +
		                    "GROUP BY Nation_C " +
		                    "ORDER BY TOTAL_MEDAL DESC ";
		    console.log(sqlquery);
		    sqlConnection(req,res,sqlquery);
		  }
		  //year medal
		  else if (year != 0 && !(medal === 'empty') && sports === 'empty'){
		    var sqlquery =  "WITH PREP AS (SELECT P.NOC, P." + medal + " AS SUM1 " +
		                    "FROM PARTICIPATE P JOIN COUNTRY C ON P.NOC = C.NOC " +
		                    "WHERE P.YEAR = '" + year + "' " + ") " +
		                    "SELECT C.Nation_C, SUM(P1.SUM1) AS TOTAL " +
		                    "FROM COUNTRY C NATURAL JOIN PREP P1 " +
		                    "GROUP BY Nation_C " +
		                    "ORDER BY TOTAL DESC ";
		    console.log(sqlquery);
		    sqlConnection(req,res,sqlquery);
		  }
		  //year sports
		  else if (year != 0 && medal === 'empty' && !(sports === 'empty')){
		    var sqlquery =  "WITH SE AS ( " +
		                    "SELECT EVENT_ID " +
		                    "FROM EVENT " +
		                    "WHERE SPORT = '" + sports + "'), " +
		                    "AW AS( SELECT * " +
		                    "FROM AWARD " +
		                    "WHERE EVENT_ID IN (SELECT EVENT_ID FROM SE) AND YEAR = '" + year + "'), " +
		                    "SA AS ( " +
		                    "SELECT A1.YEAR, A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL " +
		                    "FROM ATHLETE A2 JOIN AW A1 ON A2.ATHLETE_ID = A1.ATHLETE_ID " +  
		                    "GROUP BY A2.NATIONALITY, A1.EVENT_ID, A1.MEDAL, A1.YEAR)," +
		                    "FINAL AS (SELECT Nationality, COUNT(MEDAL) AS TOTAL " +
		                    "FROM SA " +
		                    "GROUP BY NATIONALITY) " +
		                    "SELECT C.NATION_C, SUM(F.TOTAL) AS TOTAL " +
		                    "FROM FINAL F JOIN COUNTRY C ON F.NATIONALITY = C.NATION " +
				   			"GROUP BY Nation_C " +
		                    "ORDER BY TOTAL DESC ";
		    console.log(sqlquery);
		    sqlConnection(req,res,sqlquery);
		  }
		  //year
		  else if (year != 0 && medal === 'empty' && sports === 'empty'){
		    var sqlquery =  "WITH PREP AS (SELECT P.NOC, P.TOTAL AS SUM1 " +
		                    "FROM PARTICIPATE P JOIN COUNTRY C ON P.NOC = C.NOC " +
		                    "WHERE P.YEAR = '" + year + "' " + ") " +
		                    "SELECT C.Nation_C, SUM(P1.SUM1) AS TOTAL " +
		                    "FROM COUNTRY C NATURAL JOIN PREP P1 " +
		                    "GROUP BY Nation_C " +
		                    "ORDER BY TOTAL DESC ";
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
		        //res.json(result.rows);
		        result_data = result.rows;

				Object.keys(toBeSent).forEach(function(key) {
			     	
			     	for (var i = 0; i < result_data.length; i++){
			     		if (result_data[i][0] === key){
			     			toBeSent[key] = result_data[i][1];
			     		}
			     	}
				 });

				// console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~");
				// console.log(result_data[0][0]);
				// console.log(result_data[0][1]);

				var rankData = [];

				for (var j = 0; j < result_data.length; j++){
					 rankData.push({
					 	country: result_data[j][0],
					 	medal: result_data[j][1],
					 });
				}

				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

				console.log(JSON.stringify(rankData));

				// var rankData = {
				// 	"1":{
				// 		"country":result_data[0][0],
				// 		"medal":result_data[0][1]
				// 	},
				// 	"2":{
				// 		"country":result_data[1][0],
				// 		"medal":result_data[1][1]
				// 	},
				// 	"3":{
				// 		"country":result_data[2][0],
				// 		"medal":result_data[2][1]

				// 	},
				// 	"4":{
				// 		"country":result_data[3][0],
				// 		"medal":result_data[3][1]
				// 	},
				// 	"5":{
				// 		"country":result_data[4][0],
				// 		"medal":result_data[4][1]
				// 	},
				// 	"6":{
				// 		"country":result_data[5][0],
				// 		"medal":result_data[5][1]
				// 	}
				// };
				res.json({toBeSent:toBeSent, rankData:rankData});


		        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
		        console.log(result.rows);     // [ [ 180, 'Construction' ] ]

		        doRelease(connection);
		      });
		  });

    var toBeSent = {"UnitedStates":0, 
	     				"France":0,
	     				"Germany":0,
	     				"Australia":0, 
	     				"GreatBritain":0, 
	     				"Russia":0,
	     				"Italy":0,
	     				"Sweden":0,
	     				"Canada":0,
	     				"China":0,
	     				"Argentina":0, 
	     				"Hungary":0,
	     				 "Norway":0, 
	     				 "Netherlands":0, 
	     				 "Poland":0, 
	     				 "Japan":0, 
	     				 "Finland":0, 
	     				 "Switzerland":0, 
	     				 "Austria":0,
	     				 "Denmark":0,
						"Romania":0,
						"SouthKorea":0,
						"Belgium":0,
						"Bulgaria":0,
						"Greece":0,
						"Czechoslovakia":0,
						"Ukraine":0,
						"Spain":0,
						"Cuba":0,
						"Belarus":0,
						"NewZealand":0,
						"Brazil":0,
						"Czech":0,
						"Kazakhstan":0,
						"Yugoslavia":0,
						"SouthAfrica":0,
						"Turkey":0,
						"Argentina":0,
						"Azerbaijan":0,
						"NorthKorea":0,
						"Mexico":0,
						"Iran":0,
						"Croatia":0,
						"Slovenia":0,
						"Estonia":0,
						"Uzbekistan":0,
						"Ireland":0,
						"Egypt":0,
						"Georgia":0,
						"Kenya":0,
						"Latvia":0,
						"Mongolia":0,
						"Colombia":0,
						"Portugal":0,
						"Thailand":0,
						"Slovakia":0,
						"Lithuania":0,
						"Nigeria":0,
						"Jamaica":0,
						"Taiwan":0,
						"Armenia":0,
						"Venezuela":0,
						"India":0,
						"Indonesia":0,
						"Serbia":0,
						"Algeria":0,
						"Morocco":0,
						"Chile":0,
						"TrinidadTobago":0,
						"Tunisia":0,
						"Australasia":0,
						"Ethiopia":0,
						"PuertoRico":0,
						"Moldova":0,
						"Malaysia":0,
						"SouthKorea":0,
						"Israel":0,
						"Luxembourg":0,
						"Philippines":0,
						"Bohemia":0,
						"Uganda":0,
						"Bahamas":0,
						"Uruguay":0,
						"DominicanRepublic":0,
						"YugoslavFederation":0,
						"Liechtenstein":0,
						"Zimbabwe":0,
						"Peru":0,
						"Iceland":0,
						"Kyrgyzstan":0,
						"Vietnam":0,
						"Qatar":0,
						"Tajikistan":0,
						"Cameroon":0,
						"Singapore":0,
						"Lebanon":0,
						"Syria":0,
						"SaudiArabia":0,
						"Pakistan":0,
						"ChineseTaipei":0,
						"HongKong":0,
						"IvoryCoast":0,
						"Bahrain":0,
						"Ghana":0,
						"Panama":0,
						"BritishIndia":0,
						"Zambia":0,
						"UnitedArabEmirates":0,
						"Independent":0,
						"Tanzania":0,
						"Kuwait":0,
						"Afghanistan":0,
						"Haiti":0,
						"Niger":0,
						"Burundi":0,
						"Namibia":0,
						"BritishWestIndies":0,
						"SriLanka":0,
						"CostaRica":0,
						"VirginIslandsUS":0,
						"Iraq":0,
						"Sudan":0,
						"Tonga":0,
						"Fiji":0,
						"Macedonia":0,
						"Togo":0,
						"Guyana":0,
						"Paraguay":0,
						"Jordan":0,
						"Botswana":0,
						"Suriname":0,
						"Montenegro":0,
						"Barbados":0,
						"Senegal":0,
						"Mozambique":0,
						"Guatemala":0,
						"SerbiaandMontenegro":0,
						"Djibouti":0,
						"NetherlandAntilles":0,
						"Gabon":0,
						"Ecuador":0,
						"Mauritius":0,
						"Cyprus":0,
						"Grenada":0,
						"Bermuda":0,
						"Eritrea":0,
						"Monaco":0,
						"Kosovo":0};


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
