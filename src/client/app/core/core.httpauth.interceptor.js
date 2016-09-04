(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('httpAuthService', httpAuthService);

    httpAuthService.$inject = [ '$injector', '$rootScope', '$q', '$cookies' ];
    function httpAuthService( $injector, $rootScope, $q, $cookies ) {
        var service = {
            responseError : responseError
        };
        
        return service;

        ////////////////
        function responseError( response ) {
            var $state = $injector.get( '$state' );
            if ( [ 401, 403 ].indexOf( response.status ) >= 0 && !$state.includes( 'login' ) && !$state.includes( 'confirmation' ) ) {
                delete $rootScope.principal;
                $cookies.remove( 'clkioLoginCode' );
                $state.go( 'login' );
            }
            return $q.reject( response );
        }
    }
})();