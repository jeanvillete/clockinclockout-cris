(function(){
    'use strict';
    
    angular.module( 'app.profile.details' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'profileDetails',
                config : {
                    url : '/profileDetails',
                    templateUrl : 'app/profile.details/profile.details.html',
                    controller : 'ProfileDetailsController',
                    controllerAs : 'vm',
                    title : 'Profile Details',
                    settings : {
                    },
                    params : {
                        profile : null
                    }
                }
            }
        ];
    }
})();