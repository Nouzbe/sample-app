app.provider('currentSession', function () {
    this.$get = ['$http', '$location', '$q', 'messageDigestor', function ($http, $location, $q, messageDigestor) {
        var currentSessionProvider = {
            userId: null,
            username: null,
            gravatarRootUrl: 'http://www.gravatar.com/avatar/',
            gravatarUrl: null,
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
            getUserId: function() {
                return this.userId;
            },
            setUserId: function(userId) {
                this.userId = userId;
            },
            getGravatarUrl: function() {
                return this.gravatarUrl;
            },
            setGravatarUrl: function(email) {
                this.gravatarUrl = this.gravatarRootUrl + messageDigestor.MD5(email);
            },
            getGravatarRootUrl: function() {
                return this.gravatarRootUrl;
            },
            checkLoggedIn: function() {
                var d = $q.defer();
                $http.get('/api/isloggedin').
                    success(function(result){
                        // authenticated
                        if(result !== '0'){
                            currentSessionProvider.setUsername(result.local.username);
                            currentSessionProvider.setUserId(result._id);
                            currentSessionProvider.setGravatarUrl(result.local.email);
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
