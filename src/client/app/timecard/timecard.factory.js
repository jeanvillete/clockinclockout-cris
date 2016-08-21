(function() {
    'use strict';

    angular
        .module('app.timecard')
        .factory('timecardService', timecardService);

    timecardService.$inject = [ '$http', 'clkioHost', 'exception', 'dateFilter', '$q' ];
    function timecardService( $http, clkioHost, exception, dateFilter, $q ) {
        var service = {
            getTimecard : getTimecard,
            punchOClock : punchOClock,
            saveNotes : saveNotes,
            saveExpectedHours : saveExpectedHours
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

        function saveNotes( profile, params ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/notes';

            if ( !params.text )
                return $q.reject( toastr.error( "The field 'notes' has to be filled.", "Hey, fill it please.") );

            return $http.put( api, params )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Issue raised while persisting 'notes'.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function saveExpectedHours( profile, params ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/expectedhours';

            if ( !params.expectedHours )
                return $q.reject( toastr.error( "The field 'expected hours' is mandatory.", "Ops, something is missing.") );

            return $http.put( api, params )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Problem while persisting 'expected hours'.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
    }
})();