app.controller('headerCtrl', ['$scope', '$resource', function ($scope, $resource){

	$scope.authenticated = false;
	$scope.user = "John Doe";
	
	$scope.logout = function(){
		$scope.authenticated = false;
	};

	$scope.login = function(){
		$scope.authenticated = true;
	}
}]);
