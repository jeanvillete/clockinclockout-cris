(function() {
    'use strict';

    angular
        .module('app.email')
        .controller('EmailController', EmailController);
    
    EmailController.$inject = [];
    /* @ngInject */
    function EmailController() {
        var vm = this;

        activate();

        ////////////////

        function activate() { }
    }
})();