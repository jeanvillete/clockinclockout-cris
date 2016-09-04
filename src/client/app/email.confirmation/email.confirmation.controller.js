(function() {
    'use strict';

    angular
        .module('app.email.confirmation')
        .controller('EmailConfirmationController', EmailConfirmationController);
    
    EmailConfirmationController.$inject = [ 'emailService', '$stateParams' ];
    /* @ngInject */
    function EmailConfirmationController( emailService, $stateParams ) {
        var vm = this;
        vm.emailAddress;
        vm.confirmationCode;
        vm.error;
        vm.success;
        
        activate();

        ////////////////

        function activate() {
            vm.error = false;
            vm.success = false;

            vm.emailAddress = '';
            vm.confirmationCode = '';

            if ( !( $stateParams.emailAddress && $stateParams.q ) ) {
                vm.error = true;
                return;
            }

            vm.emailAddress = $stateParams.emailAddress;
            vm.confirmationCode = $stateParams.q;

            var email = {
                emailAddress : vm.emailAddress,
                confirmationCode : vm.confirmationCode
            };

            return emailService.confirm( email )
                .then( success, fail );

            ////////////////

            function success( data ) {
                vm.success = true;
            }

            function fail( e ) {
                vm.error = true;
            }
        }
    }
})();