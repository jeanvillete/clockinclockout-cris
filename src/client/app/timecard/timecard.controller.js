(function() {
    'use strict';

    angular
        .module('app.timecard')
        .controller('TimecardController', TimecardController);
    
    TimecardController.$inject = [ '$rootScope', '$injector', '$cookies', 'profileService', 'timecardService', '$q' ];
    /* @ngInject */
    function TimecardController( $rootScope, $injector, $cookies, profileService, timecardService, $q ) {
        var vm = this;
        vm.timecard = {};

        activate();

        ///////////////

        function activate() {
            if ( !$cookies.get( 'clkioLoginCode' ) ) {
                return $injector.get( '$state' ).go( 'login' );
            } else if ( !$rootScope.principal ) {
                $rootScope.principal = {
                    clkioLoginCode : $cookies.get( 'clkioLoginCode' ),
                    user : $cookies.get( 'user' )
                };
            }

            getProfile().then( getTimecard );
        }

        function getTimecard( profile ) {
            return timecardService.getTimecard( profile )
                .then( success );

            ///////////////

            function success( data ) {
                vm.timecard = data.timeCard;
            }
        }

        function getProfile() {
            return $q.when( $rootScope.principal.profile || profileService.list().then( success ) );

            ///////////////

            function success( data ){
                $rootScope.principal.profiles = data.profiles;
                $rootScope.principal.profile = data.profiles[ 0 ];

                return $rootScope.principal.profile;
            }
        }

    }
})();