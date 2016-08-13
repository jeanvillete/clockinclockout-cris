(function(){
    'use strict';
    
    angular.module( 'app.timecard' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'timecard',
                config : {
                    url : '/',
                    templateUrl : 'app/timecard/timecard.html',
                    controller : 'TimecardController',
                    controllerAs : 'vm',
                    title : 'Timecard',
                    settings : {
                    }
                }
            }
        ];
    }
})();