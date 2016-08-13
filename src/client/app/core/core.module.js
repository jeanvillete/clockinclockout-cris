(function() {
  'use strict';

  angular
    .module('app.core', [
      'ui.router',
      'ngCookies',
      'blocks.exception',
      'blocks.logger',
      'blocks.router',
      'app.login',
      'app.timecard',
      'app.profile'
    ]);
})();
