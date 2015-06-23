app.directive('header', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "/partials/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            $scope.authenticated = false;
			
			$scope.logout = function(){
				$scope.authenticated = false;
			};
			$scope.login = function(){
				$scope.authenticated = true;
			}
        }]
    }
});
