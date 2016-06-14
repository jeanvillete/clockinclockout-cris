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
		},
		complete : req.complete || {}
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

clkio.msgBox = {};
clkio.msgBox.error = function( title, msg ) {
	var modal = $( "#modal-error-msg" );
	modal.find( "strong" ).text( title || "" );
	modal.find( "p" ).text( msg || "" );
	modal.modal( 'show' );
}

clkio.progress = {};
clkio.progress.on = function() {
	$( "#clkio-progress-bar" ).show();
}
clkio.progress.off = function() {
	$( "#clkio-progress-bar" ).hide();
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
    var $user = $( "#d-email" );
    
	// setup logout button
	$( "#ach-lgout" ).click( function(){
		clkio.logout();
	});
    
    // shows current logged user
	$user.empty().text( Cookies.get( "user" ) + " " ).append( $( "<span></span>" ).attr( "class", "caret" ) );
    
    clkio.profiles.load( function(){
		if ( !Cookies.get( "profile" ) )
			Cookies.set( "profile", clkio.profiles.list[0].id );
		clkio.profiles.renderNavBar();
	});
});
