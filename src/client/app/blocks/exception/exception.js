(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .factory('exception', exception);

  /* @ngInject */
  function exception($q, logger) {
    var service = {
      catcher: catcher
    };
    return service;

    function catcher( message ) {
      return function( e ) {
        var newMessage;

        if ( e.data ) {
          newMessage = message + '\n' + ( e.data.description || e.data );
        }

        logger.error(newMessage);
        return $q.reject(e);
      };
    }
  }
})();
