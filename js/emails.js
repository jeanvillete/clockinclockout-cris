var clkio = window.clkio || {};
clkio.emails = {};
clkio.emails.onChange = function(){};
clkio.emails.list = [];

clkio.emails.load = function( callback ) {
	clkio.rest({
		uri : "emails",
		success : function( resp ) {
			clkio.emails.list = resp.emails || [];
			if ( callback ) callback();
			clkio.emails.change();
		}
	});
}

clkio.emails.change = function() {
	if ( clkio.emails.onChange )
			clkio.emails.onChange();
}