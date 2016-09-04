(function() {
    'use strict';

    angular
        .module('app.adjusting')
        .factory('adjustingService', adjustingService);

    adjustingService.$inject = [ 'clkioHost', '$http', 'exception', '$q', 'toastr' ];
    /* @ngInject */
    function adjustingService( clkioHost, $http, exception, $q, toastr ) {
        var service = {
            create : create,
            update : update,
            delete : _delete
        };
        
        return service;

        ////////////////
        function _api( profile ) {
            return clkioHost + 'profiles/' + profile.id + '/adjustings/'
        }

        function create( profile, adjusting ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'profile\'s id property/value' ) );
            else if ( !adjusting.description )
                return $q.reject( toastr.error( "The field adjusting 'description' is mandatory.", "Required field.") );
            else if ( !adjusting.timeInterval )
                return $q.reject( toastr.error( "The field adjusting 'time interval' is mandatory.", "Required field.") );

            var api = _api( profile );
            
            return $http.post( api, adjusting )
                .then( success, fail );

            function success( response ) {
                toastr.success( "New 'adjusting' saved.", "Success!");
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while creating 'adjusting' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function update( profile, adjusting ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'profile\'s id property/value' ) );
            else if ( !adjusting.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'adjusting\'s id property/value' ) );
            else if ( !adjusting.description )
                return $q.reject( toastr.error( "The field adjusting 'description' is mandatory.", "Required field.") );
            else if ( !adjusting.timeInterval )
                return $q.reject( toastr.error( "The field adjusting 'time interval' is mandatory.", "Required field.") );
            
            var api = _api( profile ) + adjusting.id;

            return $http.put( api, adjusting )
                .then( success, fail );

            function success( response ) {
                toastr.success( "Record 'adjusting' changed.", "Success!");
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while updating 'adjusting' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function _delete( profile, adjusting ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'profile\'s id property/value' ) );
            else if ( !adjusting.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing the \'adjusting\'s id property/value' ) );
            
            var api = _api( profile ) + adjusting.id;

            return $http.delete( api )
                .then( success, fail );

            function success( response ) {
                toastr.success( "Record 'adjusting' deleted.", "Success!");
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while deleting 'adjusting' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
    }
})();