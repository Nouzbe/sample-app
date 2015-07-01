app.controller('userCtrl', ['$scope', '$http', function ($scope, $http){

	$scope.user = 'bam';
	
	$scope.getList = function() {
		$http.get('/api/object/'.concat($scope.user)).
		success(function(data, status, headers, config) {
			$scope.objects = data;
		}).
		error(function(data, status, headers, config) {
			// we'll see
		});
	}

	$scope.getPublicList = function() {
		$http.get('/api/public/object').
		success(function(data, status, headers, config) {
			$scope.publicObjects = data;
		}).
		error(function(data, status, headers, config) {
			// we'll see
		});
	}

	$scope.deleteObject = function(id) {
		$http.delete('/api/object/'.concat(id)).
		success(function(data, status, headers, config) {
			$scope.getList();
		}).
		error(function(data, status, headers, config) {
			// we'll see
		});
	}

	$scope.createObject = function() {
		var object =  {
			name: $scope.objectName,
			user_name: $scope.user,
			pub: false
		}
		$http.post('/api/object', object).
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
		$http.put('/api/object/'.concat(object._id), object).
		success(function(data, status, headers, config) {
			$scope.getPublicList();
		}).
		error(function(data, status, headers, config) {
			// we'll see
		})
	}

	$scope.getList();
	$scope.getPublicList();
}]);