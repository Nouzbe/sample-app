app.controller('loginCtrl', ['$scope', '$resource', '$location', function ($scope, $resource, $location){

	var Login = $resource('/api/login');
	
	$scope.login = function() {
		var login = new Login();
		login.username = $scope.username;
		login.password = $scope.password;
		login.$save(function (result){
			$location.url('/user');
		});
	}
}]);
