(function() {
    'use strict';

    angular
        .module('app.timecard')
        .controller('TimecardController', TimecardController);
    
    TimecardController.$inject = [ '$rootScope', '$scope','$injector', '$cookies', 'principalHolderService', 'timecardService', '$q', '$uibModal', '$filter', '$stateParams' ];
    /* @ngInject */
    function TimecardController( $rootScope, $scope, $injector, $cookies, principalHolderService, timecardService, $q, $uibModal, $filter, $stateParams ) {
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
            }

            $scope.$on( 'timecard_changeProfile', function( event, profile ){
                return getTimecard( profile );
            });
            
            if ( !( vm.timecard = $stateParams.timecard ) ) {
                return principalHolderService.getProfile( true ).then( getTimecard );
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

        function punchOClock( timestamp ) {
            return timecardService.punchOClock( principalHolderService.getProfile(), timestamp )
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
                return getTimecard( principalHolderService.getProfile(), vm.date );
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