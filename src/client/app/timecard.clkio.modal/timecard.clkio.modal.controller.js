(function() {
    'use strict';

    angular
        .module('timecard.clkio.modal')
        .controller('TimecardClkioModalController', TimecardClkioModalController);
    
    TimecardClkioModalController.$inject = [ '$uibModalInstance', 'minDate', 'enabledDates', 'defaultDate' ];
    /* @ngInject */
    function TimecardClkioModalController( $uibModalInstance, minDate, enabledDates, defaultDate ) {
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
            vm.datetimepicker = $( "#datetimepicker-clockin-clockout" ).datetimepicker({
                inline : true,
                sideBySide : true,
                format : 'YYYY-MM-DD HH:mm',
                useCurrent : true,
                defaultDate : defaultDate || new Date(),
                showClose : false,
                minDate : minDate,
                enabledDates : enabledDates
            });
        }
    }
})();