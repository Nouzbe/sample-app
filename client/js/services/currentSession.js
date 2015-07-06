app.provider('currentSession', function () {
    this.$get = [ function () {
        var currentSessionProvider = {
            username: 'Linh',
            getUsername: function () {
                return this.username;
            },
            setUsername: function (value) {
                this.username = value;
            },
        };
        return currentSessionProvider;
    }];
});
