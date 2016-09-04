(function() {
    'use strict';

    angular
        .module('app.reason')
        .factory('reasonService', reasonService);

    reasonService.$inject = [ 'clkioHost', '$http', 'exception', '$q', 'toastr' ];
    /* @ngInject */
    function reasonService( clkioHost, $http, exception, $q, toastr ) {
        var service = {
            create : create,
            update : update,
            delete : _delete
        };
        
        return service;

        ////////////////
        function _api( profile ) {
            return clkioHost + 'profiles/' + profile.id + '/reasons/'
        }

        function create( profile, reason ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'profile\'s id property/value' ) );
            else if ( !reason.reason )
                return $q.reject( toastr.error( "The field 'reason text' is mandatory.", "Required field.") );

            var api = _api( profile );
            
            return $http.post( api, reason )
                .then( success, fail );

            function success( response ) {
                toastr.success( "New 'reason' saved.", "Success!");
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while creating 'reason' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function update( profile, reason ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'profile\'s id property/value' ) );
            else if ( !reason.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'reason\'s id property/value' ) );
            else if ( !reason.reason )
                return $q.reject( toastr.error( "The field 'reason text' is mandatory.", "Required field.") );
            
            var api = _api( profile ) + reason.id;

            return $http.put( api, reason )
                .then( success, fail );

            function success( response ) {
                toastr.success( "Record 'reason' changed.", "Success!");
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while updating 'reason' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function _delete( profile, reason ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'profile\'s id property/value' ) );
            else if ( !reason.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'reason\'s id property/value' ) );
            
            var api = _api( profile ) + reason.id;

            return $http.delete( api )
                .then( success, fail );

            function success( response ) {
                toastr.success( "Record 'reason' deleted.", "Success!");
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while deleting 'reason' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

    }
})();