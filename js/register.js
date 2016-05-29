var clkio = window.clkio || {};

$( document ).ready( function(){
	var $frm = $( "#frm-reg" ), $email = $( "#txtb-email" ), $pwd = $( "#txtb-pwd" );
	$email.focus();
	$frm.submit(function(){
		if ( !$email.val() || !$pwd.val() ) {
			alert( "Email and Password are mandatory." );
			return false;
		}

		clkio.rest({
			method : "POST",
			uri : "users",
			data : JSON.stringify( $frm.serializeObject() ),
			success : function( resp ) {
				alert( resp.message );
				window.location.href = "index.html"
			},
			error : function( xhr ) {
				if ( xhr.responseJSON.message ) alert( xhr.responseJSON.message );
				else alert( "It was not possible record the user. Try another Email/Password." );
			}
		});

		return false;
	});
});
