var app = angular.module('sample-app', ['ngResource', 'ngRoute']).
		config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
			$locationProvider.html5Mode(true);
			$routeProvider.
				when("/", {
					templateUrl: "/../views/home.html"
				}).
				when("/register", {
					templateUrl: "/../views/register.html",
					controller: "registerCtrl"
				}).
				when("/login", {
					templateUrl: "/../views/login.html",
					controller: "loginCtrl"
				}).
				when("/user", {
					templateUrl: "/../views/user.html",
					controller: "userCtrl"
				}).
				otherwise({redirectTo: "/somethingthatdoesnotexist"});
		}]);