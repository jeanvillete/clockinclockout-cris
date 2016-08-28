(function() {
    'use strict';

    angular
        .module( 'app.clockinclockout' )
        .factory( 'clkioService', clkioService );

    clkioService.$inject = [ '$http', 'clkioHost', 'exception', '$q' ];
    /* @ngInject */
    function clkioService( $http, clkioHost, exception, $q ) {
        var service = {
            create : create,
            update : update,
            delete : _delete
        };
        
        return service;

        ////////////////

        function create( profile, clkio ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/clockinclockout';

            if ( !clkio.clockin && !clkio.clockout )
                return $q.reject( toastr.error( "The fields 'clockin' and 'clockout' are mandatory, thus at least one of them has to be filled.", "Required fields.") );

            return $http.post( api, clkio )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Hey, check what the server says out!");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function update( profile, clkio ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/clockinclockout/' + clkio.id;

            if ( !clkio.clockin && !clkio.clockout )
                return $q.reject( toastr.error( "The fields 'clockin' and 'clockout' are mandatory, thus at least one of them has to be filled.", "Required fields.") );

            return $http.put( api, clkio )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Ops, the server says there's a problem.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function _delete( profile, clkio ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/clockinclockout/' + clkio.id;
            return $http.delete( api )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Error while trying delete record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
    }
})();