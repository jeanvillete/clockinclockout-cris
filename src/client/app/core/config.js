(function() {
  'use strict';

  var core = angular.module( 'app.core' );

  var config = {
    appErrorPrefix: '[clkio Error] ',
    appTitle: 'clkio'
  };

  core.value('config', config);

  core.config( configure );

  configure.$inject = [ '$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', '$httpProvider' ];
  /* @ngInject */
  function configure( $logProvider, routerHelperProvider, exceptionHandlerProvider, $httpProvider ) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });

    $httpProvider.interceptors.push( 'httpAuthService' );
    $httpProvider.interceptors.push( 'restApiLoginCodeService' );
  }

})();
