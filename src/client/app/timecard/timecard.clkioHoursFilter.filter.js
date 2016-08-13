(function() {
    'use strict';

    angular
        .module('app.timecard')
        .filter('clkioHoursFilter', clkioHoursFilter);

    function clkioHoursFilter() {
        return function( clkio ) {
            return clkio ? clkio.substring( clkio.indexOf( ' ' ) + 1 ) : '';
        };
    }
})();