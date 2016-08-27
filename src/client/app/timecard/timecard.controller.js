(function() {
    'use strict';

    angular
        .module('app.timecard')
        .controller('TimecardController', TimecardController);
    
    TimecardController.$inject = [ '$rootScope', '$scope','$injector', '$cookies', 'profileService', 'timecardService', '$q', '$uibModal', '$filter', '$stateParams' ];
    /* @ngInject */
    function TimecardController( $rootScope, $scope, $injector, $cookies, profileService, timecardService, $q, $uibModal, $filter, $stateParams ) {
        var vm = this;
        vm.timecard = {};
        vm.date;
        vm.popBaseDateUp = popBaseDateUp;
        vm.popPunchOClockUp = popPunchOClockUp;
        vm.edit = edit;

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

            $scope.$on( 'timecard_changeProfile', function( event, profile ){
                return getTimecard( profile );
            });
            
            if ( !( vm.timecard = $stateParams.timecard ) ) {
                return getProfile().then( getTimecard );
            }
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
                $rootScope.principal.changeProfile = changeProfile;

                return $rootScope.principal.profile;

                function changeProfile( profile ) {
                    if ( $rootScope.principal.profile === profile )
                        return;
                        
                    $rootScope.principal.profile = profile;
                    $rootScope.$broadcast( 'timecard_changeProfile', profile );
                }
            }
        }

        function punchOClock( timestamp ) {
            return timecardService.punchOClock( $rootScope.principal.profile, timestamp )
                .then( success );

            ///////////////

            function success( data ) {
                vm.timecard.totalTimeMonthly = data.timeCard.totalTimeMonthly;
                vm.timecard.totalTime = data.timeCard.totalTime;

                for ( var i = 0; i < vm.timecard.days.length; i++ )
                    if ( vm.timecard.days[ i ].date === data.timeCard.days[ 0 ].date )
                        vm.timecard.days[ i ] = data.timeCard.days[ 0 ];
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

        function popPunchOClockUp() {
            return $uibModal.open({
                animation : false,
                templateUrl : 'app/timecard.punchoclock.modal/timecard.punchoclock.modal.html',
                controller : 'TimecardPunchOClockModalController',
                controllerAs : 'vm',
                size : 'sm'
            }).result.then( punchOClock );
        }

        function edit( day ) {
            var params = {
                timecard : vm.timecard,
                date : day.date
            };

            $injector.get( '$state' ).go( 'timecardDetails', params );
        }
    }
})();