(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', AccountController);
    
    AccountController.$inject = [ 'principalHolderService' ];
    /* @ngInject */
    function AccountController( principalHolderService ) {
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