(function() {
    'use strict';

    angular
        .module('app.timecard.details')
        .controller('TimecardDetailsController', TimecardDetailsController);
    
    TimecardDetailsController.$inject = [ '$injector', '$stateParams', 'timecardService' ];
    /* @ngInject */
    function TimecardDetailsController( $injector, $stateParams, timecardService ) {
        var vm = this;
        vm.day;
        vm.timecard;
        vm.back = back;

        activate();

        ////////////////

        function activate() {
            vm.timecard = $stateParams.timecard;

            if ( !vm.timecard || !( vm.day = getDay( $stateParams.date ) ) )
                $injector.get( '$state' ).go( 'timecard' );
        }

        function getDay( date ) {
            if ( !date ) return null;
            for ( var i = 0; i < vm.timecard.days.length; i++ )
                    if ( vm.timecard.days[ i ].date === date )
                        return vm.timecard.days[ i ];
            return null;
        }

        function back() {
            var params = {
                timecard : vm.timecard,
            }

            $injector.get( '$state' ).go( 'timecard', params );
        }
    }
})();