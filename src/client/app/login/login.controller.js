(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController );
    
    LoginController.$inject = [ 'loginService', '$rootScope', '$injector' ];
    /* @ngInject */
    function LoginController( loginService, $rootScope, $injector ) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.alert = false;
        vm.doLogin = doLogin;
        vm.doLogout = doLogout;

        activate();

        ////////////////

        function activate() {
        }

        function doLogin() {
            vm.alert = false;

            if ( !( vm.email && vm.password ) ) {
                vm.alert = 'Email and Password are mandatory.';
                return;
            }

            var credentials  = {
                email : vm.email,
                password : vm.password
            };

            return loginService.login( credentials )
                .then( success, fail );

            function success( data ) {
                $rootScope.principal = {
                    clkioLoginCode : data.code
                };

                $injector.get( '$state' ).go( 'timecard' );
            }

            function fail( e ) {
                return vm.alert = 'Invalid Email and/or Password.';
            }
        }

        function doLogout() {
            return loginService.logout()
                .then( success );
            
            function success( data ) {
                $rootScope.principal = false;

                $injector.get( '$state' ).go( 'login' );
            }
        }
    }
})();