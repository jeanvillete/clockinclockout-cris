var clkio = window.clkio || {};
clkio.grid = {};

clkio.rest = function( req ) {
	if ( !req || !req.uri ) {
		alert( "Invalid rest api request." );
		return;
	}

	$.ajax({
		async : req.async || true,
		cache : false,
		method : req.method || "GET",
		url : "data/" + req.uri,
		dataType : 'json',
		contentType : 'application/json',
		data : req.data || {},
		beforeSend : function( xhr ) {
			xhr.setRequestHeader( "clkioLoginCode" , Cookies.get( "clkioLoginCode" ) || '' );
			xhr.setRequestHeader( "Accept" , "application/json" );
			if ( req.beforeSend ) req.beforeSend( xhr );
		},
		statusCode : req.statusCode || {},
		success : req.success || function( data ) {
			console.log( data );
		},
		error : req.error || function( xhr, status, error ) {
			console.log( {"xhr":xhr, "status":status, "error":error} );
		}
	});
}

clkio.logout = function() {
	clkio.rest({
		uri : "logout",
		success : function( resp ) {
			Cookies.remove( "clkioLoginCode" );
			Cookies.remove( "profile" );
			window.location.href = "index.html";
		}
	});
}

clkio.grid.getButton = function( btnName, callback ) {
	return $( "<a></a>" ).attr( "class", "btn-edit" ).text( btnName ).click( callback );
}

$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$( document ).ready( function(){
	// setup logout button
	$( "#ach-lgout" ).click( function(){
		clkio.logout();
	});
});
