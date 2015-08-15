app.directive('header', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "/partials/header.html",
        controller: ['$scope', '$location', '$http','currentSession', function ($scope, $location, $http, currentSession) {
            $scope.session = currentSession;
            $scope.dropdown = {
                items: [{
                            name: 'Profile',
                            href: '/#profile'
                        }, 
                        {
                            name: 'Objects',
                            href: '/#objects'
                        }]
            }
	        $scope.register = function(){
                $location.url('/register');
            }
			$scope.login = function(){
				$location.url('/login');
			}
            $scope.logout = function(){
                $http.get('/api/logout/'.concat($scope.session.username)).
                    success(function(data, status, headers, config) {
                        $location.url('/');
                        currentSession.setAuthenticated(false);
                    }).
                    error(function(data, status, headers, config) {
                        // we'll see
                    });
            };
        }]
    }
});
