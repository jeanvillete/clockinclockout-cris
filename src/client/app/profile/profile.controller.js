(function() {
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);
    
    ProfileController.$inject = [ 'profileService', 'principalHolderService', '$injector' ];
    /* @ngInject */
    function ProfileController( profileService, principalHolderService, $injector ) {
        var vm = this;
        vm.profile;
        vm.create = create;
        vm.edit = edit;
        
        activate();

        ////////////////

        function activate() {
            if ( !principalHolderService.getLoginCode() ) {
                return $injector.get( '$state' ).go( 'login' );
            } else {
                principalHolderService.getProfiles( true );
            }
            
            vm.profile = { description:"" };
        }

        function create() {
            return profileService.create( vm.profile )
                .then( success );
            
            function success( data ) {
                principalHolderService.getProfiles().push( data.domain );
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