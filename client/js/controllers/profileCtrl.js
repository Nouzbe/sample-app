app.controller('profileCtrl', ['$scope', '$http', '$location', 'currentSession', 'growl', function ($scope, $http, $location, currentSession, growl){

	$scope.username = null;
	$scope.email = null;
	$scope.error = null;
	$scope.password = null;
	$scope.newEmail = null;
	$scope.newPassword = null;
	$scope.confirmNewPassword = null;
	$scope.emailUpdate = false;
	$scope.passwordUpdate = false;
	$scope.accountDeletion = false;
	$scope.gravatarUrl = null;

	$scope.cleanScreen = function() {
		$scope.emailUpdate = false;
		$scope.passwordUpdate = false;
		$scope.accountDeletion = false;
		$scope.error = null;
		$scope.password = null;
		$scope.newEmail = null;
		$scope.newPassword = null;
		$scope.confirmNewPassword = null;
	}

	$scope.showEmailForm = function() {
		$scope.cleanScreen();
		$scope.emailUpdate = true;
	}

	$scope.showPasswordForm = function() {
		$scope.cleanScreen();
		$scope.passwordUpdate = true;
	}

	$scope.showAccountForm = function() {
		$scope.cleanScreen();
		$scope.accountDeletion = true;
	}

	$scope.loadUserInfo = function() {
        $http.get('/api/profile/'.concat($scope.username)).
			success(function(data, status, headers, config) {
				$scope.username = data.username;
				$scope.email = data.email;
				$scope.gravatarUrl = currentSession.getGravatarUrl();
			}).
			error(function(data, status, headers, config) {
				// we'll see
			});
	}

	$scope.updateEmail = function() {
		if($scope.email == $scope.newEmail){
			$scope.error.newEmail = 'The new email should be different from the old.';
		}
		else {
			var emailUpdate = {
				email: $scope.newEmail,
				password: $scope.password
			};
			$http.put('/api/profile/changeemail/'.concat($scope.username), emailUpdate).
			success(function(data, status, headers, config) {
				if(data.message.toLowerCase().indexOf('password') != -1){
					$scope.error.password = 'wrong password';
				}
				else if(data.message === 'ok') {
					currentSession.setGravatarUrl($scope.newEmail);
					growl.success('<b>Yay !</b> Email changed.');
					$scope.cleanScreen();
				}
				$scope.loadUserInfo();
			}).
			error(function(data, status, headers, config) {
				// we'll see
			})
		}
	}

	$scope.updatePassword = function() {
		if($scope.newPassword !== $scope.confirmNewPassword){
			$scope.error.confirmNewPassword = 'Looks like a typo.';
		}
		else if($scope.newPassword == $scope.password){
			$scope.error.newPassword = 'The new password should be different.';
		}
		else {
			var passwordUpdate = {
				newPassword: $scope.newPassword,
				password: $scope.password
			};
			$http.put('/api/profile/changepassword/'.concat($scope.username), passwordUpdate).
			success(function(data, status, headers, config) {
				if(data.message.toLowerCase().indexOf('password') != -1){
					$scope.error.password = 'wrong password';
				}
				else if(data.message === 'ok') {
					growl.success('<b>Yay !</b> Password changed.');
					$scope.cleanScreen();
				}
			}).
			error(function(data, status, headers, config) {
				// we'll see
			})
		}
	}

	$scope.deleteAccount = function() {
		$http.post('/api/profile/deleteAccount/'.concat($scope.username), {password: $scope.password}).
			success(function(data, status, headers, config) {
				if(data.message.toLowerCase().indexOf('password') != -1){
					$scope.error.password = 'wrong password';
				}
				else if(data.message === 'ok') {
					$http.get('/api/logout').
	                    success(function(data, status, headers, config) {
	                        growl.success('Your account was just deleted.');
	                        currentSession.setAuthenticated(false);
	                        $location.url('/');
	                    }).
	                    error(function(data, status, headers, config) {
	                        // we'll see
	                    });
				}
			}).
			error(function(data, status, headers, config) {
				// we'll see
			})
	}

	currentSession.checkLoggedIn().then(function(){
		$scope.username = currentSession.username;
		$scope.loadUserInfo();
	});
}]);

