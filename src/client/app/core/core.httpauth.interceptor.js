(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('httpAuthService', httpAuthService);

    httpAuthService.$inject = [ '$injector', '$rootScope', '$q' ];
    function httpAuthService( $injector, $rootScope, $q ) {
        var service = {
            responseError : responseError
        };
        
        return service;

        ////////////////
        function responseError( response ) {
            var $state = $injector.get( '$state' );
            if ( [ 401, 403 ].indexOf( response.status ) >= 0 && !$state.includes( 'login' ) ) {
                delete $rootScope.principal;
                $state.go( 'login' );
            }
            return $q.reject( response );
        }
    }
})();