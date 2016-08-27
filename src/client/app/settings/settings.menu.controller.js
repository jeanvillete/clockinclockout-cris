(function() {
    'use strict';

    angular
        .module('app.settings')
        .controller('SettingsMenuController', SettingsMenuController);
    
    SettingsMenuController.$inject = [ '$injector' ];
    /* @ngInject */
    function SettingsMenuController( $injector ) {
        var vm = this;
        vm.isSelected = isSelected;

        ////////////////

        function isSelected( option ) {
            var $state = $injector.get( '$state' );
            return $state.includes( option );
        }
    }
})();