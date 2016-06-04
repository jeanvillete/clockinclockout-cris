var clkio = window.clkio || {};

$( document ).ready( function(){
	var $frm = $( "#frm-lgn" ), $email = $( "#txtb-email" ), $pwd = $( "#txtb-pwd" );
	$email.focus();
	$frm.submit( function(){
		if ( !$email.val() || !$pwd.val() ) {
			alert( "Email and Password are mandatory." );
			return false;
		}

		clkio.rest({
			uri : "login",
			success : function( data ){
				if ( data.code ) {
					Cookies.set( "clkioLoginCode", data.code );
					Cookies.set( "user", $email.val() );
					window.location.href = "timecard.html";
				} else alert( "Invalid 'success answer'. No 'clkioLoginCode' found on the answer." );
			},
			beforeSend : function( xhr ) {
				xhr.setRequestHeader( "Authorization" ,
					"Basic " + btoa( $email.val() + ":" + $pwd.val() ) );
			},
			statusCode : {
				401 : function() {
					alert( "The provided email/password dont't match." );
					$pwd.val("");
					$email.val("");
					$email.focus();
				}
			}
		});
		return false;
	});
});
