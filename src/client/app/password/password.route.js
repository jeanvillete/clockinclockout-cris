(function(){
    'use strict';
    
    angular.module( 'app.password' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'password',
                config : {
                    url : '/password',
                    templateUrl : 'app/password/password.html',
                    controller : 'PasswordController',
                    controllerAs : 'vm',
                    title : 'Password',
                    settings : {
                    }
                }
            }
        ];
    }
})();