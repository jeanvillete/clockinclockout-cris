(function() {
    'use strict';

    angular
        .module('app.timecard')
        .factory('timecardService', timecardService);

    timecardService.$inject = [ '$http', 'clkioHost', 'exception' ];
    function timecardService( $http, clkioHost, exception ) {
        var service = {
            getTimecard : getTimecard
        };
        
        return service;

        ////////////////

        function getTimecard( profile ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard';
            return $http.get( api )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
    }
})();