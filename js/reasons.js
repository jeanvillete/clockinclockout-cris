var clkio = window.clkio || {};
clkio.reasons = {};

clkio.reasons.list = function( callback ) {
	clkio.rest({
		async : false,
		uri : clkio.profiles.uri() + "/reasons",
		success : function( resp ) {
			callback( resp );
		}
	});
}
