(function() {
    'use strict';

    angular
        .module('app.timecard')
        .controller('TimecardController', TimecardController);
    
    TimecardController.$inject = [ '$rootScope', '$injector', '$cookies' ];
    /* @ngInject */
    function TimecardController( $rootScope, $injector, $cookies ) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            if ( !$rootScope.principal && !( $rootScope.principal = $cookies.get( 'clkioLoginCode' ) ) ) {
                $injector.get( '$state' ).go( 'login' );
            }
        }
    }
})();