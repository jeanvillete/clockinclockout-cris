(function() {
    'use strict';

    angular
        .module('app.profile')
        .factory('profileService', profileService);

    profileService.$inject = [ 'clkioHost','$http', 'exception', '$q', 'toastr', '$rootScope' ];
    /* @ngInject */
    function profileService( clkioHost, $http, exception, $q, toastr, $rootScope ) {
        var api = clkioHost + 'profiles/';
        var service = {
            list : list,
            create : create,
            update : update,
            delete : _delete
        };
        
        return service;

        ////////////////
        function list() {
            return $http.get( api )
                .then( success, fail );

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
        
        function create( profile ) {
            if ( !profile.description )
                return $q.reject( toastr.error( "The field 'profile description' is mandatory.", "Required field.") );

            var _profile = {};
            angular.extend( _profile, $rootScope.principal.profile );
            _profile.id = null;
            _profile.reasons = [];
            _profile.adjustings = [];
            _profile.description = profile.description;

            return $http.post( api, _profile )
                .then( success, fail );

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Fail while creating 'profile' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
        
        function update( profile ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing an id property/value' ) );

            if ( !profile.description
                || !profile.hoursFormat
                || !profile.dateFormat
                || !profile.expectedSaturday
                || !profile.expectedFriday
                || !profile.expectedThursday
                || !profile.expectedSunday
                || !profile.expectedMonday
                || !profile.expectedTuesday
                || !profile.expectedWednesday )
                return $q.reject( toastr.error( "All the fields regarding the profile are mandatory.", "Required fields.") );

            return $http.put( api + profile.id, profile )
                .then( success, fail );

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Error while updating 'profile' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
        
        function _delete( profile ) {
            if ( !profile.id )
                return $q.reject( console.error( 'Invalid state object, it\'s missing an id property/value.' ) );

            if ( $rootScope.principal.profile.id === profile.id )
                return $q.reject( toastr.warning( 'This profile is the current one in use, please pick up another one and try again.',
                    'Impossible delete current profile.') );

            return $http.delete( api + profile.id )
                .then( success, fail );

            function success( response ) {
                return response.data;
            }

            function fail( e ) {
                toastr.error( e.data.message, "Exception received on deleting 'profile' record.");
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

    }
})();