var app = angular.module('sample-app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate', 'angular-growl']).
		config(['$routeProvider','$locationProvider', 'growlProvider' , function($routeProvider, $locationProvider, growlProvider) {
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
				when("/forgotMyPassword", {
					templateUrl: "/../views/forgotPassword.html",
					controller: "forgotPasswordCtrl"
				}).
				when("/profile", {
					templateUrl: "/../views/profile.html",
					controller: "profileCtrl"
				}).
				otherwise({redirectTo: "/somethingthatdoesnotexist"});

			growlProvider.globalTimeToLive(3000);
    		growlProvider.globalEnableHtml(true);
		}]);