(function(){
    'use strict';
    
    angular.module( 'app.email' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'email',
                config : {
                    url : '/email',
                    templateUrl : 'app/email/email.html',
                    controller : 'EmailController',
                    controllerAs : 'vm',
                    title : 'Email',
                    settings : {
                    }
                }
            }
        ];
    }
})();