var clkio = window.clkio || {};
clkio.profiles = {};

clkio.profiles.list = function( callback ) {
	clkio.rest({
		async : false,
		uri : "profiles",
		success : function( resp ) {
			callback( resp );
		}
	});
}

clkio.profiles.uri = function() {
	return "profiles/" + Cookies.get( "profile" );
}
