(function() {
    'use strict';

    angular
        .module('app.settings')
        .controller('SettingsMenuController', SettingsMenuController);
    
    SettingsMenuController.$inject = [ '$injector', '$scope' ];
    /* @ngInject */
    function SettingsMenuController( $injector, $scope ) {
        $scope.isSelected = isSelected;

        ////////////////

        function isSelected( option ) {
            var $state = $injector.get( '$state' );
            return $state.includes( option );
        }
    }
})();