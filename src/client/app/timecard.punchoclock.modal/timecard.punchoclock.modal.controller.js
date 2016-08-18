(function() {
    'use strict';

    angular
        .module('timecard.punchoclock.modal')
        .controller('TimecardPunchOClockModalController', TimecardPunchOClockModalController);
    
    TimecardPunchOClockModalController.$inject = [ '$uibModalInstance' ];
    /* @ngInject */
    function TimecardPunchOClockModalController( $uibModalInstance ) {
        var vm = this;
        vm.datetimepicker;
        vm.select = select;
        vm.cancel = cancel;
        vm.show = show;

        ////////////////

        function select() {
            var pickedDateUp = vm.datetimepicker.data( 'DateTimePicker' ).date();

            vm.datetimepicker.data( 'DateTimePicker' ).destroy();
            $uibModalInstance.close( pickedDateUp.toDate() );
        }

        function cancel() {
            vm.datetimepicker.data( 'DateTimePicker' ).destroy();
            $uibModalInstance.dismiss( 'cancel' );
        }

        function show() {
            vm.datetimepicker = $( "#datetimepicker-punch-o-clock" ).datetimepicker({
                inline : true,
                format : 'HH:mm',
                useCurrent : true,
                showClose : false,
                defaultDate : new Date()
            });
        }
    }
})();