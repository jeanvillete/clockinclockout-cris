(function() {
    'use strict';

    angular
        .module('app.timecard')
        .controller('TimecardController', TimecardController);
    
    TimecardController.$inject = [ '$rootScope', '$injector', '$cookies', 'profileService', 'timecardService', '$q', '$uibModal' ];
    /* @ngInject */
    function TimecardController( $rootScope, $injector, $cookies, profileService, timecardService, $q, $uibModal ) {
        var vm = this;
        vm.timecard = {};
        vm.date;
        vm.popBaseDateUp = popBaseDateUp;

        activate();

        ///////////////

        function activate() {
            vm.date = new Date();

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

        function getTimecard( profile, date ) {
            return timecardService.getTimecard( profile, date )
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

        function popBaseDateUp() {
            $uibModal.open({
                animation : false,
                templateUrl : 'app/timecard.basedate.modal/timecard.basedate.modal.html',
                controller : 'TimecardBaseDateModalController',
                controllerAs : 'vm',
                size : 'sm',
                resolve : {
                    defaultDate : function() { return vm.date; }
                }
            }).result.then( success );

            function success( date ) {
                vm.date = date;
                return getTimecard( $rootScope.principal.profile, vm.date );
            }
        }

    }
})();