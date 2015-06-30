app.controller('registerCtrl', ['$scope', '$resource', '$location', function ($scope, $resource, $location){

	var Register = $resource('/api/register');

	$scope.register = function() {
		var register = new Register();
		register.username = $scope.username;
		register.email = $scope.email;
		register.password = $scope.password;
		register.$save(function (result){
			$location.url('/user');
		});
	}
}]);
