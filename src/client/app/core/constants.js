/* global moment:false */
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('moment', moment)
    .constant( 'clkioHost', 'http://rest.clkio.com/' );
})();
