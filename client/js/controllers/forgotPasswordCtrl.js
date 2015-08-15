app.controller('forgotPasswordCtrl', ['$scope', '$http', '$location', 'growl', function ($scope, $http, $location, growl){
    
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
                else if(data.message.toLowerCase().indexOf('mailer') != -1){
                    growl.addErrorMessage('<b>Oops !</b> We currently have an issue with our mails. Please sit back and relax while we fix it and try again in a couple of minutes.');
                }
            }).
            error(function(data, status, headers, config) {
                // We'll see
            });
    }
}]);
