(function() {
    'use strict';

    angular
        .module('timecard.basedate.modal')
        .controller('TimecardBaseDateModalController', TimecardBaseDateModalController);
    
    TimecardBaseDateModalController.$inject = [ '$uibModalInstance', 'defaultDate' ];
    /* @ngInject */
    function TimecardBaseDateModalController( $uibModalInstance, defaultDate ) {
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
            vm.datetimepicker = $( "#datimepicker-month-year" ).datetimepicker({
                inline : true,
                format : 'MMM YYYY',
                useCurrent : true,
                defaultDate : defaultDate,
                showClose : false
            });
        }
    }
})();