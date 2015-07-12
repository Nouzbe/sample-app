app.controller('forgotPasswordCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location){
    
    $scope.done = false;
    $scope.error = {
        username: null
    }

    $scope.sendMeNew = function() {
        $http.get('/api/forgotPassword/'.concat($scope.username)).
            success(function(data, status, headers, config) {
                if( data.message == "ok"){
                    $scope.done = true;
                }
                else if ( data.message == 'ko'){
                    $scope.error.username = 'Huh, do I know you ?';
                }
            }).
            error(function(data, status, headers, config) {
                // We'll see
            });
    }
}]);
