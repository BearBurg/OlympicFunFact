var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
        $scope.Submit = function() {
            $scope.title = 10;
        //var request = $http.get('/countryInfo'+$scope.top+$scope.medals+$scope.sports+$scope.discipline+$scope.gender+$scope.season);
        var request = $http.get('/',{params: {
            //$scope.title = 10;
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



// app.controller('athleteController', function($scope, $http) {
//     $scope.FindAthlete = function() {
//     $http.get('/athleteInfo',{params: {
//         top:    $scope.top,
//         medal:  $scope.medal,
//         sports: $scope.sports,
//         discipline:$scope.discipline,
//         gender: $scope.gender,
//         season: $scope.season
//     }})
//     .success(
//         function(data){
//             $scope.data = data;
//         })
//     .error(
//         function(error){
//             console.log(error);
//         });
// };
// });


