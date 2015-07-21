app.controller('profileCtrl', ['$scope', '$http', 'currentSession', function ($scope, $http, currentSession){

	$scope.username = null;
	$scope.email = null;
	$scope.emailUpdate = false;
	$scope.passwordUpdate = false;
	$scope.accountDeletion = false;

	$scope.cleanScreen = function() {
		$scope.emailUpdate = false;
		$scope.passwordUpdate = false;
		$scope.accountDeletion = false;
	}

	$scope.showEmailForm = function() {
		$scope.emailUpdate = true;
		$scope.passwordUpdate = false;
		$scope.accountDeletion = false;
	}

	$scope.showPasswordForm = function() {
		$scope.emailUpdate = false;
		$scope.passwordUpdate = true;
		$scope.accountDeletion = false;
	}

	$scope.showAccountForm = function() {
		$scope.emailUpdate = false;
		$scope.passwordUpdate = false;
		$scope.accountDeletion = true;
	}

	$scope.loadUserInfo = function() {
        $http.get('/api/profile').
			success(function(data, status, headers, config) {
				$scope.username = data.username;
				$scope.email = data.email;
			}).
			error(function(data, status, headers, config) {
				// we'll see
			});
	}

	$scope.changeUsername = function() {

	};

	$scope.changeEmail = function() {

	};

	$scope.changePassword = function() {

	};

	currentSession.checkLoggedIn().then(function(){
		$scope.loadUserInfo();
	});
}]);
