(function() {
    'use strict';

    angular
        .module('app.timecard.details')
        .controller('TimecardDetailsController', TimecardDetailsController);
    
    TimecardDetailsController.$inject = [ '$injector', '$stateParams', 'timecardService', '$uibModal', 'dateFilter', 'moment', 'clkioService', 'manualEnteringService', 'principalHolderService' ];
    /* @ngInject */
    function TimecardDetailsController( $injector, $stateParams, timecardService, $uibModal, dateFilter, moment, clkioService, manualEnteringService, principalHolderService ) {
        var vm = this;
        vm.clkio;
        vm.manualEntering;
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
        vm.createManualEntering = createManualEntering;
        vm.updateManualEntering = updateManualEntering;
        vm.deleteManualEntering = deleteManualEntering;

        activate();

        ////////////////

        function activate() {
            vm.timecard = $stateParams.timecard;

            if ( !vm.timecard || !( vm.day = getDay( $stateParams.date ) ) )
                return $injector.get( '$state' ).go( 'timecard' );

            vm.expectedHours = vm.day.expectedHours;
            vm.notes = vm.day.notes;
            vm.clkio = { clockin:'', clockout:'' };
            vm.manualEntering = { reason: { id: 0 }, timeInterval: '', id: 0 };
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

            return timecardService.saveNotes( principalHolderService.getProfile(), params )
                .then( updateModel );
        }

        function saveExpectedHours() {
            var params = {
                "date" : vm.day.date,
                "expectedHours" : vm.expectedHours
            };

            return timecardService.saveExpectedHours( principalHolderService.getProfile(), params )
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
                        return moment( vm.day.date, principalHolderService.getProfile().dateFormat.toUpperCase() );
                    },
                    enabledDates : function() {
                        return setProperty === 'clockin' ? [ moment( vm.day.date, principalHolderService.getProfile().dateFormat.toUpperCase() ) ] : false;
                    },
                    defaultDate : function() {
                        if ( clkio[ setProperty ] ) {
                            return moment( clkio[ setProperty ], principalHolderService.getProfile().dateFormat.toUpperCase() + ' ' + principalHolderService.getProfile().hoursFormat );
                        }

                        var now = new Date();
                        var thisMoment = moment( vm.day.date, principalHolderService.getProfile().dateFormat.toUpperCase() );
                        thisMoment.hour( now.getHours() );
                        thisMoment.minute( now.getMinutes() );
                        return thisMoment;
                    }
                }
            }).result.then( success );

            ///////////////

            function success( date ) {
                clkio[ setProperty ] = dateFilter( date, principalHolderService.getProfile().dateFormat + ' ' + principalHolderService.getProfile().hoursFormat );
            }
        }

        function createClockinClockout( clkio ) {
            return clkioService.create( principalHolderService.getProfile(), clkio )
                .then( success );

            ///////////////

            function success( data ) {
                clkio.clockin = '';
                clkio.clockout = '';

                updateModel( data );
            }
        }

        function updateClockinClockout( clkio ) {
            return clkioService.update( principalHolderService.getProfile(), clkio )
                .then( updateModel );
        }

        function deleteClockinClockout( clkio ) {
            if ( !confirm( 'Confirm delete?' ) )
                return;

            return clkioService.delete( principalHolderService.getProfile(), clkio )
                .then( updateModel );
        }

        function createManualEntering( manualEntering ) {
            angular.extend( manualEntering, { day : vm.day } );
            return manualEnteringService.create( principalHolderService.getProfile(), manualEntering )
                .then( success );

            ///////////////

            function success( data ) {
                angular.extend( manualEntering, { reason: { id: 0 }, timeInterval: '', id: 0 } );
                updateModel( data );
            }
        }

        function updateManualEntering( manualEntering ) {
            manualEntering.day = { date : vm.day.date };
            return manualEnteringService.update( principalHolderService.getProfile(), manualEntering )
                .then( updateModel );
        }

        function deleteManualEntering( manualEntering ) {
            if ( !confirm( 'Confirm delete?' ) )
                return;

            return manualEnteringService.delete( principalHolderService.getProfile(), manualEntering )
                .then( updateModel );
        }
    }
})();