var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
    // data = {country:"aaa", num:"3"};
    //         console.log("data.country");
    //         $scope.data = data;
       // $scope.message="";
        $scope.Submit = function() {
//             var text = '{ "employees" : [' +
// '{ "firstName":"John" , "lastName":"Doe" },' +
// '{ "firstName":"Anna" , "lastName":"Smith" },' +
// '{ "firstName":"Peter" , "lastName":"Jones" } ]}';
//         var obj = JSON.parse(text);
//         console.log(obj.employees[1].firstName + " " + obj.employees[1].lastName);
        //var request = $http.get('/countryInfo'+$scope.top+$scope.medals+$scope.sports+$scope.discipline+$scope.gender+$scope.season);
        var request = $http.get('/countryInfo',{params: {
            top:    $scope.top,
            medal:  $scope.medal,
            sports: $scope.sports,
            discipline:$scope.discipline,
            gender: $scope.gender,
            season: $scope.season
        }});
        request.success(function(data) {
            //data = {country:"aaa", num:"3"};
            $scope.data = data;
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


