(function() {
    'use strict';

    angular
        .module('app.profile')
        .factory('profileService', profileService);

    profileService.$inject = ['clkioHost','$http'];
    /* @ngInject */
    function profileService( clkioHost, $http ) {
        var service = {
            list : list
        };
        
        return service;

        ////////////////
        function list() {
            var api = clkioHost + 'profiles';

            return $http.get( api )
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