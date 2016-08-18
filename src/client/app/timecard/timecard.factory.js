(function() {
    'use strict';

    angular
        .module('app.timecard')
        .factory('timecardService', timecardService);

    timecardService.$inject = [ '$http', 'clkioHost', 'exception', 'dateFilter' ];
    function timecardService( $http, clkioHost, exception, dateFilter ) {
        var service = {
            getTimecard : getTimecard
        };
        
        return service;

        ////////////////

        function getTimecard( profile, date ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/' + ( date ? dateFilter( date, 'yyyy-MM' ) : '' );
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