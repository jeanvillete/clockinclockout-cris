(function() {
    'use strict';

    angular
        .module('app.timecard')
        .filter('reasonOnlyFilter', reasonOnlyFilter);

    function reasonOnlyFilter() {
        return function( tableEntering ) {
            var _return = [];
            angular.forEach( tableEntering, function( entering, key ){
                if ( entering.reason ) _return.push( entering );
            });
            return _return;
        };
    }
})();