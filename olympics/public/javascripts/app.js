var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
    $scope.title = 10;
    // data = {country:"aaa", num:"3"};
    //         console.log("data.country");
    //         $scope.data = data;
       // $scope.message="";
       console.log("here");
        $scope.Submit = function() {
            alert("here");
            // var top = document.getElementById("top").value;
            // var medal = document.getElementById("medals").value;
            // var sport = document.getElementById("sports").value;
            // var gender = document.getElementById("gender").value;
            // var season = document.getElementById("season").value;
        //var request = $http.get('/countryInfo'+$scope.top+$scope.medals+$scope.sports+$scope.discipline+$scope.gender+$scope.season);
        $http.get('/data',{ params: {
            top:    "$scope.top",
            medal:  $scope.medals,
            sports: $scope.sports,
            discipline:$scope.discipline,
            gender: $scope.gender,
            season: $scope.season
        }});
        request.success(function(data) {
            //data = {country:"aaa", num:"3"};
            //$scope.data = data;
            $scope.NATIONALITY = data.NATIONALITY;
            $scope.NUM = data.NUM;
        });
        request.error(function(data){
            console.log('err');
        });
    //     $http.get('/countryInfo',{params: {
    //     top:    $scope.top,
    //     medal:  $scope.medal,
    //     sports: $scope.sports,
    //     discipline:$scope.discipline,
    //     gender: $scope.gender,
    //     season: $scope.season
    // }})
    // .success(
    //     function(success){
    //         console.log(success);
    //     })
    // .error(
    //     function(error){
    //         console.log(error);
    //     });
    
    }; 
});



app.controller('athleteController', function($scope, $http) {
    $scope.FindAthlete = function() {
    $http.get('/athleteInfo',{params: {
        top:    $scope.top,
        medal:  $scope.medal,
        sports: $scope.sports,
        discipline:$scope.discipline,
        gender: $scope.gender,
        season: $scope.season
    }})
    .success(
        function(data){
            $scope.data = data;
            //console.log(success);
        })
    .error(
        function(error){
            console.log(error);
        });
};
});


