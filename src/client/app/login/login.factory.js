(function() {
    'use strict';

    angular
        .module('app.login')
        .factory('loginService', loginService);

    loginService.$inject = [ '$http', 'clkioHost', 'exception', '$cookies', 'principalHolderService' ];
    function loginService( $http, clkioHost, exception, $cookies, principalHolderService ) {
        var service = {
            login : login,
            logout : logout
        };
        
        return service;

        ////////////////
        function login( credentials ) {
            var api = clkioHost + 'login';
            
            return $http.get( api, authorization() )
                .then( success, fail );
            
            function authorization() {
                return {
                    headers : {
                        authorization : 'Basic ' + btoa( credentials.email + ':' + credentials.password )
                    }
                }
            }

            function success( response ) {
                $cookies.put( 'clkioLoginCode', response.data.code );
                $cookies.put( 'user', credentials.email );
                principalHolderService.restore();

                return response.data;
            }

            function fail( e ) {
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }

        function logout() {
            var api = clkioHost + 'logout';

            return $http.get( api )
                .then( success, fail );

            function success( response ) {
                $cookies.remove( 'clkioLoginCode' );
                $cookies.remove( 'user' );
                principalHolderService.restore();

                return response.data;
            }

            function fail( e ) {
                return exception.catcher( 'XHR Failed for; ' + api )( e );
            }
        }
    }
})();