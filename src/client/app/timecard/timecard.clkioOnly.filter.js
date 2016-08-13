(function() {
    'use strict';

    angular
        .module('app.timecard')
        .filter('clkioOnlyFilter', clkioOnlyFilter);

    function clkioOnlyFilter() {
        return function( tableEntering ) {
            var _return = [];
            angular.forEach( tableEntering, function( entering, key ){
                if ( entering.clockin || entering.clockout ) _return.push( entering );
            });
            return _return;
        };
    }
})();