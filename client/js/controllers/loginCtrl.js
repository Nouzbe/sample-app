app.controller('loginCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location){
	
	$scope.error = {
		username: 'name',
		password: 'pwd'
	}

	$scope.login = function() {
		var login = {
			username: $scope.username,
			password: $scope.password
		}
		$http.post('/api/login', login).
			success(function(data, status, headers, config) {
				$location.url('/user');
			}).
			error(function(data, status, headers, config) {
				// we'll see
			});
	}
}]);
