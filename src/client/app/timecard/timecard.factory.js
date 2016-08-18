(function() {
    'use strict';

    angular
        .module('app.timecard')
        .factory('timecardService', timecardService);

    timecardService.$inject = [ '$http', 'clkioHost', 'exception', 'dateFilter' ];
    function timecardService( $http, clkioHost, exception, dateFilter ) {
        var service = {
            getTimecard : getTimecard,
            punchOClock : punchOClock
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

        function punchOClock( profile, timestamp ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/';
            var data = {
                timestamp : dateFilter( timestamp, profile.dateFormat + ' ' + profile.hoursFormat )
            };

            return $http.post( api, data )
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