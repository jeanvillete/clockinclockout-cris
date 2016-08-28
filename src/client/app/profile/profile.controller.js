(function() {
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);
    
    ProfileController.$inject = [ 'profileService', '$rootScope', '$injector' ];
    /* @ngInject */
    function ProfileController( profileService, $rootScope, $injector ) {
        var vm = this;
        vm.profile;
        vm.create = create;
        vm.edit = edit;
        
        activate();

        ////////////////

        function activate() {
            vm.profile = { description:"" };
        }

        function create() {
            return profileService.create( vm.profile )
                .then( success );
            
            function success( data ) {
                $rootScope.principal.profiles.push( data.domain );
                vm.profile = { description:"" };
                return edit( data.domain );
            }
        }

        function edit( profile ) {
            var params = {
                profile : profile
            };
            $injector.get( '$state' ).go( 'profileDetails', params );
        }
    }
})();