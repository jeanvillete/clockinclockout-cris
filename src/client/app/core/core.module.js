(function() {
  'use strict';

  angular
    .module('app.core', [
      'ui.router',
      'ngCookies',
      'ui.bootstrap',
      'blocks.exception',
      'blocks.logger',
      'blocks.router',
      'app.login',
      'app.timecard',
      'app.settings',
      'app.principal.holder',
      'app.register',
      'app.email.confirmation'
    ]);
})();
