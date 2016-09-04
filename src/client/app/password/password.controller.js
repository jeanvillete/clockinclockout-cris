(function() {
    'use strict';

    angular
        .module( 'app.password' )
        .controller('PasswordController', PasswordController);
    
    PasswordController.$inject = [ 'principalHolderService' ];
    /* @ngInject */
    function PasswordController( principalHolderService ) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            if ( !principalHolderService.getLoginCode() ) {
                return $injector.get( '$state' ).go( 'login' );
            } else {
                principalHolderService.getProfiles( true );
            }
        }
    }
})();