(function() {
    'use strict';

    angular
        .module('app.settings')
        .directive('settingsMenu', settingsMenuDirective);

    settingsMenuDirective.$inject = [];
    /* @ngInject */
    function settingsMenuDirective() {
        var directive = {
            controller: 'SettingsMenuController',
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl : 'app/settings/settings.menu.html'
        };
        return directive;
    }
})();