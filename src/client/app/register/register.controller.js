(function() {
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController);
    
    RegisterController.$inject = [ 'userService' ];
    /* @ngInject */
    function RegisterController( userService ) {
        var vm = this;
        vm.email;
        vm.password;
        vm.confirmPassword;
        vm.alert;
        vm.successMessage;
        vm.doRegister = doRegister;
        
        activate();

        ////////////////

        function activate() {
            vm.email = '';
            vm.password = '';
            vm.confirmPassword = '';
            vm.alert = false;
            vm.successMessage = false;
        }

        function doRegister() {
            vm.alert = false;

            if ( !( vm.email && vm.password && vm.confirmPassword ) ) {
                vm.alert = 'All of the fields are mandatory.';
                return;
            }

            if ( vm.password !== vm.confirmPassword ) {
                vm.alert = 'Please, correct the value for the field \'confirm password\'.';
                return;
            }

            var credentials = {
                email : vm.email,
                password : vm.password
            };

            return userService.register( credentials )
                .then( success, fail );

            ///////////////

            function success( data ) {
                vm.successMessage = true;
            }

            function fail( e ) {
                return vm.alert = e.data.message;
            }
        }
    }
})();