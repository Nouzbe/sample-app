app.provider('currentSession', function () {
    this.$get = ['$http', '$location', '$q', function ($http, $location, $q) {
        var currentSessionProvider = {
            username: null,
            authenticated: null,
            isAuthenticated: function() {
                return this.authenticated;
            },
            setAuthenticated: function(authenticated) {
                this.authenticated = authenticated;
            },
            getUsername: function() {
                return this.username;
            },
            setUsername: function(username) {
                this.username = username;
            },
            checkLoggedIn: function() {
                var d = $q.defer();
                $http.get('/api/isloggedin').
                    success(function(result){
                        // authenticated
                        if(result !== '0'){
                            currentSessionProvider.setUsername(result.local.username);
                            currentSessionProvider.setAuthenticated(true);
                            d.resolve();
                        }
                        // not authenticated
                        else {
                            $location.url('/login');
                            d.reject();
                        }
                    });
                return d.promise;
            }
        };
        return currentSessionProvider;
    }];
});
