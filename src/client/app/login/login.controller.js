(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController );
    
    LoginController.$inject = [ 'dependency1' ];
    /* @ngInject */
    function LoginController(dependency1) {
        var vm = this;
        

        activate();

        ////////////////

        function activate() { }
    }
})();