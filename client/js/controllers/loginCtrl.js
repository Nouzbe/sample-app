app.controller('loginCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location){
	
	$scope.error = {
		username: null,
		password: null
	}

	$scope.login = function() {
		var login = {
			username: $scope.username,
			password: $scope.password
		}
		$http.post('/api/login', login).
			success(function(data, status, headers, config) {
				var message = headers('Message');
				if(message.toLowerCase().indexOf('username') != -1){
					$scope.error.username = message;
				}
				else if(message.toLowerCase().indexOf('password') != -1){
					$scope.error.password = message;
				} else {
					$location.url('/objects');
				}
			}).
			error(function(data, status, headers, config) {
				// we'll see
			});
	}

}]);
