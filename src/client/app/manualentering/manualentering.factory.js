(function() {
    'use strict';

    angular
        .module('app.manualentering')
        .factory('manualEnteringService', manualEnteringService);

    manualEnteringService.$inject = [ '$http', 'clkioHost', 'exception', '$q' ];
    /* @ngInject */
    function manualEnteringService( $http, clkioHost, exception, $q ) {
        var service = {
            create : create,
            update : update,
            delete : _delete
        };
        
        return service;

        ////////////////

        function create( profile, manualEntering ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/manualentering';

            if ( !manualEntering.reason.id )
                return $q.reject( toastr.error( "Pick a valid 'reason' up before.", "Required fields.") ); 
            else if ( !manualEntering.timeInterval )
                return $q.reject( toastr.error( "Field 'time interval' is mandatory", "Required fields.") );

            return $http.post( api, manualEntering )
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

        function update( profile, manualEntering ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/manualentering/' + manualEntering.id;

            if ( !manualEntering.reason.id )
                return $q.reject( toastr.error( "Pick a valid 'reason' up before.", "Required fields.") );
            else if ( !manualEntering.timeInterval )
                return $q.reject( toastr.error( "Field 'time interval' is mandatory", "Required fields.") );

            return $http.put( api, manualEntering )
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

        function _delete( profile, manualEntering ) {
            var api = clkioHost + 'profiles/' + profile.id +  '/timecard/manualentering/' + manualEntering.id;
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