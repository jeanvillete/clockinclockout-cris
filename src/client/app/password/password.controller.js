(function() {
    'use strict';

    angular
        .module( 'app.password' )
        .controller('PasswordController', PasswordController);
    
    PasswordController.$inject = [];
    /* @ngInject */
    function PasswordController() {
        var vm = this;

        activate();

        ////////////////

        function activate() { }
    }
})();