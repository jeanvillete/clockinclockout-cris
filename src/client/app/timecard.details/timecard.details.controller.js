(function() {
    'use strict';

    angular
        .module('app.timecard.details')
        .controller('TimecardDetailsController', TimecardDetailsController);
    
    TimecardDetailsController.$inject = [ '$rootScope', '$injector', '$stateParams', 'timecardService' ];
    /* @ngInject */
    function TimecardDetailsController( $rootScope, $injector, $stateParams, timecardService ) {
        var vm = this;
        vm.expectedHours;
        vm.notes;
        vm.day;
        vm.timecard;
        vm.back = back;
        vm.saveNotes = saveNotes;
        vm.saveExpectedHours = saveExpectedHours;

        activate();

        ////////////////

        function activate() {
            vm.timecard = $stateParams.timecard;

            if ( !vm.timecard || !( vm.day = getDay( $stateParams.date ) ) )
                return $injector.get( '$state' ).go( 'timecard' );

            vm.expectedHours = vm.day.expectedHours;
            vm.notes = vm.day.notes;
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
    }
})();