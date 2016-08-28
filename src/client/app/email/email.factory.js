(function() {
    'use strict';

    angular
        .module('app.email')
        .factory( 'emailService', emailService );

    emailService.$inject = [ '$http', '$q', 'clkioHost', 'exception', 'toastr' ];
    /* @ngInject */
    function emailService( $http, $q, clkioHost, exception, toastr ) {
        var api = clkioHost + 'emails/';
        var service = {
            list:list,
            create : create,
            delete : _delete,
            setAsPrimary : setAsPrimary
        };
        
        return service;

        ////////////////
        function list() {
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
        
        function create( email ) {
            if ( !email.emailAddress )
                return $q.reject( toastr.error( "The field 'email address' is mandatory.", "Field not filled.") );

            return $http.post( api, email )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while creating 'email' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
        
        function _delete( email ) {
            if ( !email.id )
                return $q.reject( console.error( 'Invalid object state, it was supposed it has the "id" be filled.' ) );

            return $http.delete( api + email.id )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Ops, a fail has happend while deleting 'email' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
        
        function setAsPrimary( email ) {
            if ( !email.id )
                return $q.reject( console.error( 'Invalid object state, it was supposed it has the "id" be filled.' ) );

            return $http.put( api + email.id, { "primary" : true } )
                .then( success, fail );

            ////////////////

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Problems while setting 'email' record as primary.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
        
    }
})();