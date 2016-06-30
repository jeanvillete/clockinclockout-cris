var clkio = window.clkio || {};
clkio.reasons = {};
clkio.reasons.list = [];

clkio.reasons.load = function( callback ) {
	clkio.rest({
		uri : clkio.profiles.uri() + "/reasons",
		success : function( resp ) {
			clkio.reasons.list = resp.reasons || [];
			if ( callback ) callback();
		}
	});
}
