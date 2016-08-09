(function() {
  'use strict';

  angular
    .module('app.core', [
      'blocks.exception',
      'blocks.logger',
      'blocks.router',
      'app.login',
      'ui.router'
    ]);
})();
