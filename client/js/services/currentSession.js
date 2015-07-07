app.provider('currentSession', function () {
    this.$get = ['$http', '$location', function ($http, $location) {
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
                $http.get('/api/isloggedin').
                    success(function(result){
                        var user = result.local.username;
                        // authenticated
                        if(user !== '0'){
                            currentSessionProvider.setUsername(user);
                            currentSessionProvider.setAuthenticated(true);
                        }
                        // not authenticated
                        else {
                            $location.url('/login');
                        }
                    });
            }
        };
        return currentSessionProvider;
    }];
});
