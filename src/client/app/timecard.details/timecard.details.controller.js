(function() {
    'use strict';

    angular
        .module('app.timecard.details')
        .controller('TimecardDetailsController', TimecardDetailsController);
    
    TimecardDetailsController.$inject = [ '$rootScope', '$injector', '$stateParams', 'timecardService', '$uibModal', 'dateFilter', 'moment', 'clkioService' ];
    /* @ngInject */
    function TimecardDetailsController( $rootScope, $injector, $stateParams, timecardService, $uibModal, dateFilter, moment, clkioService ) {
        var vm = this;
        vm.clkio;
        vm.expectedHours;
        vm.notes;
        vm.day;
        vm.timecard;
        vm.back = back;
        vm.saveNotes = saveNotes;
        vm.saveExpectedHours = saveExpectedHours;
        vm.popClkioUp = popClkioUp;
        vm.createClockinClockout = createClockinClockout;
        vm.updateClockinClockout = updateClockinClockout;
        vm.deleteClockinClockout = deleteClockinClockout;

        activate();

        ////////////////

        function activate() {
            vm.timecard = $stateParams.timecard;

            if ( !vm.timecard || !( vm.day = getDay( $stateParams.date ) ) )
                return $injector.get( '$state' ).go( 'timecard' );

            vm.expectedHours = vm.day.expectedHours;
            vm.notes = vm.day.notes;
            vm.clkio = { clockin:'', clockout:'' };
        }

        function getDay( date ) {
            if ( !date ) return null;
            for ( var i = 0; i < vm.timecard.days.length; i++ )
                    if ( vm.timecard.days[ i ].date === date )
                        return vm.timecard.days[ i ];
            return null;
        }

        function updateModel( data ) {
            vm.day = data.timeCard.days[ 0 ];

            vm.expectedHours = vm.day.expectedHours;
            vm.notes = vm.day.notes;

            vm.timecard.totalTimeMonthly = data.timeCard.totalTimeMonthly;
            vm.timecard.totalTime = data.timeCard.totalTime;

            for ( var i = 0; i < vm.timecard.days.length; i++ )
                if ( vm.timecard.days[ i ].date === data.timeCard.days[ 0 ].date )
                    vm.timecard.days[ i ] = data.timeCard.days[ 0 ];
        }

        function back() {
            var params = {
                timecard : vm.timecard,
            }

            return $injector.get( '$state' ).go( 'timecard', params );
        }

        function saveNotes() {
            var params = {
                "date" : vm.day.date,
                "text" : vm.notes
            };

            return timecardService.saveNotes( $rootScope.principal.profile, params )
                .then( updateModel );
        }

        function saveExpectedHours() {
            var params = {
                "date" : vm.day.date,
                "expectedHours" : vm.expectedHours
            };

            return timecardService.saveExpectedHours( $rootScope.principal.profile, params )
                .then( updateModel );
        }

        function popClkioUp( clkio, setProperty ) {
            return $uibModal.open({
                animation : false,
                templateUrl : 'app/timecard.clkio.modal/timecard.clkio.modal.html',
                controller : 'TimecardClkioModalController',
                controllerAs : 'vm',
                resolve : {
                    minDate : function() {
                        return moment( vm.day.date, $rootScope.principal.profile.dateFormat.toUpperCase() );
                    },
                    enabledDates : function() {
                        return setProperty === 'clockin' ? [ moment( vm.day.date, $rootScope.principal.profile.dateFormat.toUpperCase() ) ] : false;
                    },
                    defaultDate : function() {
                        if ( clkio[ setProperty ] ) {
                            return moment( clkio[ setProperty ], $rootScope.principal.profile.dateFormat.toUpperCase() + ' ' + $rootScope.principal.profile.hoursFormat );
                        }

                        var now = new Date();
                        var thisMoment = moment( vm.day.date, $rootScope.principal.profile.dateFormat.toUpperCase() );
                        thisMoment.hour( now.getHours() );
                        thisMoment.minute( now.getMinutes() );
                        return thisMoment;
                    }
                }
            }).result.then( success );

            ///////////////

            function success( date ) {
                clkio[ setProperty ] = dateFilter( date, $rootScope.principal.profile.dateFormat + ' ' + $rootScope.principal.profile.hoursFormat );
            }
        }

        function createClockinClockout( clkio ) {
            return clkioService.create( $rootScope.principal.profile, clkio )
                .then( success );

            ///////////////

            function success( data ) {
                clkio.clockin = '';
                clkio.clockout = '';

                updateModel( data );
            }
        }

        function updateClockinClockout( clkio ) {
            return clkioService.update( $rootScope.principal.profile, clkio )
                .then( updateModel );
        }

        function deleteClockinClockout( clkio ) {
            if ( !confirm( 'Confirm delete?' ) )
                return;

            return clkioService.delete( $rootScope.principal.profile, clkio )
                .then( updateModel );
        }

    }
})();