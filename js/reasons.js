var clkio = window.clkio || {};
clkio.reasons = {};
clkio.reasons.list = [];

clkio.reasons.load = function( callback ) {
	clkio.rest({
		async : false,
		uri : clkio.profiles.uri() + "/reasons",
		success : function( resp ) {
			clkio.reasons.list = resp.reasons || [];
			callback();
		}
	});
}
