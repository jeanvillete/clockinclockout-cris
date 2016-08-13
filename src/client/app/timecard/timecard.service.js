(function() {
    'use strict';

    angular
        .module('app.timecard')
        .factory('timecardService', timecardService);

    timecardService.$inject = [ '$http', 'clkioHost' ];
    function timecardService( $http, clkioHost ) {
        var service = {
            getTimecard : getTimecard
        };
        
        return service;

        ////////////////
        function getTimecard( profile ) {
            $http.get( clkioHost + '/profile/' + profile.id +  '/timecard' );
        }
    }
})();