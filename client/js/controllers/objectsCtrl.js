app.controller('objectsCtrl', ['$scope', '$http', 'currentSession', function ($scope, $http, currentSession){

	$scope.getList = function() {
        $http.get('/api/object/'.concat($scope.username)).
			success(function(data, status, headers, config) {
				$scope.objects = data;
			}).
			error(function(data, status, headers, config) {
				// we'll see
			});
	}

	$scope.getPublicList = function() {
		$http.get('/api/public/object/'.concat($scope.username)).
		success(function(data, status, headers, config) {
			$scope.publicObjects = data;
		}).
		error(function(data, status, headers, config) {
			// we'll see
		});
	}

	$scope.deleteObject = function(id) {
		$http.delete('/api/object/'.concat($scope.username).concat('/').concat(id)).
		success(function(data, status, headers, config) {
			$scope.getList();
			$scope.getPublicList();
		}).
		error(function(data, status, headers, config) {
			// we'll see
		});
	}

	$scope.createObject = function() {
		var object =  {
			name: $scope.objectName,
			user_name: $scope.username,
			pub: false
		}
		$http.post('/api/object/'.concat($scope.username), object).
		success(function(data, status, headers, config) {
			$scope.objectName = '';
			$scope.getList();
		}).
		error(function(data, status, headers, config) {
			// we'll see
		})
	}

	$scope.publishObject = function(object) {
		object.pub = true;
		$http.get('/api/object/publish/'.concat($scope.username).concat('/').concat(object._id)).
		success(function(data, status, headers, config) {
			$scope.getPublicList();
		}).
		error(function(data, status, headers, config) {
			// we'll see
		})
	}

	currentSession.checkLoggedIn().then(function(){
		$scope.username = currentSession.getUsername();
		$scope.getPublicList();
		$scope.getList();
	});
}]);