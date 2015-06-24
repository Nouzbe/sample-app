app.controller('meetupCtrl', ['$scope', '$resource', function ($scope, $resource){

	var Meetup = $resource('/api/meetups');
	
	$scope.getList = function() {
		Meetup.query(function (results){
			$scope.meetups = results;
		});
	}
	
	$scope.createMeetup = function() {
		var meetup = new Meetup();
		meetup.name = $scope.meetupName;
		meetup.$save(function (result){
			$scope.meetups.push(result);
		});
		$scope.meetupName = '';
	}

	$scope.deleteMeetup = function(id) {
		$resource('/api/meetup/:id').delete({id:id});
		$scope.getList();
	}

	$scope.getList();
}]);
