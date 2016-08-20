(function(){
    'use strict';
    
    angular.module( 'app.timecard.details' ).run( appRun );
    
    appRun.$inject = [ 'routerHelper' ];
    /* @ngInject */
    function appRun( routerHelper ){
        routerHelper.configureStates( getStates() );
    }

    function getStates() {
        return [
            {
                state : 'timecardDetails',
                config : {
                    url : '/timecardDetails',
                    templateUrl : 'app/timecard.details/timecard.details.html',
                    controller : 'TimecardDetailsController',
                    controllerAs : 'vm',
                    title : 'Timecard Details',
                    settings : {
                    },
                    params : {
                        timecard : null,
                        date : null
                    }
                }
            }
        ];
    }
})();