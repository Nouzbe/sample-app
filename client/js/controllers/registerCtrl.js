app.controller('registerCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location){

	$scope.error = {
		username: null,
		email: null,
		password: null,
		confirmPassword: null
	};

	$scope.register = function() {
		if($scope.password !== $scope.confirmPassword){
			$scope.error.confirmPassword = 'Looks like a typo.';
		}
		else {
			var register = {
				username: $scope.username,
				email: $scope.email,
				password: $scope.password
			};
			$http.post('/api/register', register).
				success(function(data, status, headers, config) {
					$location.url('/user');
				}).
				error(function(data, status, headers, config) {
					$scope.error.username = 'That\'s already taken.';
				});
		}
	}
}]);
