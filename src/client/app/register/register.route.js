(function(){
    'use strict';
    
    angular.module( 'app.register' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'register',
                config : {
                    url : '/register',
                    templateUrl : 'app/register/register.html',
                    controller : 'RegisterController',
                    controllerAs : 'vm',
                    title : 'Register',
                    settings : {
                    }
                }
            }
        ];
    }
})();