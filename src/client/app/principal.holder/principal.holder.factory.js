(function() {
    'use strict';

    angular
        .module('app.principal.holder')
        .factory('principalHolderService', principalHolderService);

    principalHolderService.$inject = [ 'profileService', '$q', '$rootScope', '$cookies' ];
    /* @ngInject */
    function principalHolderService( profileService, $q, $rootScope, $cookies ) {
        var profiles = null, profile = null;

        var service = {
            getLoginCode : getLoginCode,
            getProfiles : getProfiles,
            getProfile : getProfile
        };

        $rootScope.principal = {
            clkioLoginCode : $cookies.get( 'clkioLoginCode' ),
            user : $cookies.get( 'user' ),
            changeProfile : changeProfile 
        };

        return service;

        ////////////////

        function getProfiles( _async ) {
            return _async ? ( !profiles ? load().then( activateRootScope ).then( getProfiles ) : $q.resolve( profiles ) ) : profiles;
        }

        function getProfile( _async ) {
            return _async ? ( !profile ? load().then( activateRootScope ).then( getProfile ) : $q.resolve( profile ) ) : profile;
        }

        function load() {
            return profileService.list()
                .then( success );

            function success( data ) {
                profiles = data.profiles;
                profile = profiles[ 0 ];
            }
        }

        function activateRootScope() {
            $rootScope.principal.profiles = profiles;
            $rootScope.principal.profile = profile;
        }

        function changeProfile( _profile ) {
            if ( profile === _profile ) return;

            profile = _profile;
            activateRootScope();
            $rootScope.$broadcast( 'timecard_changeProfile', profile );
        }

        function getLoginCode() {
            return $rootScope.principal.clkioLoginCode;
        }
    }
})();