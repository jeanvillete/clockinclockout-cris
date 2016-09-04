(function(){
    'use strict';
    
    angular.module( 'app.email.confirmation' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'confirmation',
                config : {
                    url : '/checkemail/:emailAddress?q',
                    templateUrl : 'app/email.confirmation/email.confirmation.html',
                    controller : 'EmailConfirmationController',
                    controllerAs : 'vm',
                    title : 'Email Confirmation',
                    settings : {
                    }
                }
            }
        ];
    }
})();