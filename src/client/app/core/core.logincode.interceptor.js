(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('restApiLoginCodeService', restApiLoginCodeService);

    restApiLoginCodeService.$inject = ['$cookies', '$q'];
    /* @ngInject */
    function restApiLoginCodeService( $cookies, $q ) {
        var service = {
            request : request
        };
        
        return service;

        ////////////////
        function request( config ) {
            config.headers[ 'clkioLoginCode' ] = $cookies.get( 'clkioLoginCode' );
            return $q.when( config );
        }
    }
})();