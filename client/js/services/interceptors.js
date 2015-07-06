// app.factory('httpRequestInterceptor', function ($q, $location) {
//     return {
//         'responseError': function (response) {
//                 if(response.status === 401)
//                     $location.url('/login');
//                 return $q.reject(response);
//             }
//         }
//     };
// });

app.config(function($httpProvider) {
	$httpProvider.interceptors.push(function($q, $location) {
		return {
			response: function(response) {
				return response;
			},
			responseError: function(response) {
				if(response.status === 401)
					$location.url('/login');
				return $q.reject(response);
			}
		};
	});
});