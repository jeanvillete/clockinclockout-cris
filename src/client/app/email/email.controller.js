(function() {
    'use strict';

    angular
        .module('app.email')
        .controller('EmailController', EmailController);
    
    EmailController.$inject = [ 'emailService', '$injector', 'principalHolderService' ];
    /* @ngInject */
    function EmailController( emailService, $injector, principalHolderService ) {
        var vm = this;
        vm.email;
        vm.emails;
        vm.create = create;
        vm.delete = _delete;
        vm.setAsPrimary = setAsPrimary;

        activate();

        ////////////////

        function activate() {
            if ( !principalHolderService.getLoginCode() ) {
                return $injector.get( '$state' ).go( 'login' );
            } else {
                principalHolderService.getProfiles( true );
            }

            vm.emails = [];
            vm.email = { "emailAddress":"" };

            list();
        }

        function list() {
            return emailService.list()
                .then( success );

            function success( data ) {
                vm.emails = data.emails;
            }
        }

        function create() {
            return emailService.create( vm.email )
                .then( success );

            function success( data ) {
                vm.emails.push( data.domain );
                vm.email = { "emailAddress":"" };
            }
        }

        function _delete( email ) {
            if ( !confirm( 'Confirm delete?' ) )
                return;

            return emailService.delete( email )
                .then( success );

            function success( data ) {
                var index = vm.emails.indexOf( email );
                if ( index > -1 ) vm.emails.splice( index, 1 );
            }
        }

        function setAsPrimary( email ) {
            if ( !confirm( 'Confirm email as primary?' ) )
                return;

            return emailService.setAsPrimary( email )
                .then( success );

            function success( data ) {
                for ( var i = 0; i < vm.emails.length; i ++ ) {
                    vm.emails[ i ].primary = false;
                    if ( vm.emails[ i ].id === email.id ) {
                        email.primary = true;
                        vm.emails[ i ] = email;
                    }
                }
            }
        }
    }
})();