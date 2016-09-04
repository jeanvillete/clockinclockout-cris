(function() {
    'use strict';

    angular
        .module( 'app.user' )
        .factory( 'userService', userService );

    userService.$inject = [ '$http', 'clkioHost', 'exception' ];
    /* @ngInject */
    function userService( $http, clkioHost, exception ) {
        var service = {
            register : register
        };
        
        return service;

        ////////////////
        function register( credentials ) {
            var api = clkioHost + 'users';

            return $http.post( api, credentials )
                .then( success, fail );

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
    }
})();