var app = angular.module('sample-app', ['ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate', 'angular-growl', '720kb.tooltips']).
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
				when("/objects", {
					templateUrl: "/../views/objects.html",
					controller: "objectsCtrl"
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

			growlProvider.globalTimeToLive(8000);
    		growlProvider.globalEnableHtml(true);
		}]);