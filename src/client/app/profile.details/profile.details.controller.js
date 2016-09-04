(function() {
    'use strict';

    angular
        .module('app.profile.details')
        .controller('ProfileDetailsController', ProfileDetailsController);
    
    ProfileDetailsController.$inject = [ 'profileService', 'adjustingService', 'reasonService', '$stateParams', '$injector', 'principalHolderService' ];
    /* @ngInject */
    function ProfileDetailsController( profileService, adjustingService, reasonService, $stateParams, $injector, principalHolderService ) {
        var vm = this;
        vm.profile;
        vm.adjusting;
        vm.reason;
        vm.update = update;
        vm.delete = _delete;
        vm.createAdjusting = createAdjusting;
        vm.updateAdjusting = updateAdjusting;
        vm.deleteAdjusting = deleteAdjusting;
        vm.createReason = createReason;
        vm.updateReason = updateReason;
        vm.deleteReason = deleteReason;

        activate();

        ////////////////

        function activate() {
            if ( !$stateParams.profile )
                return $injector.get( '$state' ).go( 'profile' );
            
            if ( !$stateParams.profile.adjustings )
                $stateParams.profile.adjustings = [];
            
            if ( !$stateParams.profile.reasons )
                $stateParams.profile.reasons = [];

            vm.profile = {};
            angular.extend( vm.profile, $stateParams.profile );

            vm.adjusting = { description:null, timeInterval:null };
            vm.reason = { reason:null };
        }

        function update() {
            return profileService.update( vm.profile )
                .then( success );
            
            function success( data ) {
                angular.extend( $stateParams.profile, vm.profile );
            }
        }

        function _delete() {
            if ( !confirm( 'Confirm delete?' ) )
                return;

            return profileService.delete( vm.profile )
                .then( success );
            
            function success( data ) {
                var index = principalHolderService.getProfiles().indexOf( $stateParams.profile );
                if ( index > -1 ) principalHolderService.getProfiles().splice( index, 1 );
                $injector.get( '$state' ).go( 'profile' );
            }
        }

        function createAdjusting() {
            return adjustingService.create( $stateParams.profile, vm.adjusting )
                .then( success );

            function success( data ) {
                vm.profile.adjustings.push( data.domain );
                vm.adjusting = { description:null, timeInterval:null };
            }
        }

        function updateAdjusting( adjusting ) {
            return adjustingService.update( $stateParams.profile, adjusting );
        }
        
        function deleteAdjusting( adjusting ) {
            if ( !confirm( 'Confirm delete?' ) )
                return;
                
            return adjustingService.delete( $stateParams.profile, adjusting )
                .then( success );

            function success( data ) {
                for ( var index = 0; index < vm.profile.adjustings.length; index++ )
                    if ( vm.profile.adjustings[ index ].id === adjusting.id )
                        vm.profile.adjustings.splice( index, 1 );
            }
        }

        function createReason() {
            return reasonService.create( $stateParams.profile, vm.reason )
                .then( success );

            function success( data ) {
                vm.profile.reasons.push( data.domain );
                vm.reason = { reason:null };
            }
        }

        function updateReason( reason ) {
            return reasonService.update( $stateParams.profile, reason );
        }
        
        function deleteReason( reason ) {
            if ( !confirm( 'Confirm delete?' ) )
                return;
                
            return reasonService.delete( $stateParams.profile, reason )
                .then( success );

            function success( data ) {
                for ( var index = 0; index < vm.profile.reasons.length; index++ )
                    if ( vm.profile.reasons[ index ].id === reason.id )
                        vm.profile.reasons.splice( index, 1 );
            }
        }
    }
})();