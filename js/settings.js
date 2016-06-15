var clkio = window.clkio || {};
clkio.settings = {};
clkio.settings.onChange = function(){};

clkio.settings.change = function() {
	if ( clkio.settings.onChange )
			clkio.settings.onChange();
}

clkio.settings.renderEmails = function() {
    var $emailBsComponent = $( "#row-panel-emails div.bs-component" ),
        $inputGroup = $emailBsComponent.find( "div.input-group-add" );
    
    clkio.settings.change();
    $( "li#clkio-nav-pill-emails" ).addClass( "active" );
    
    $inputGroup.siblings().remove();
    $inputGroup.find( "input:text[name=id]" ).val( "" )
    $inputGroup.find( "input:text[name=emailAddress]" ).focus().val( "" );
    
    $.each( clkio.emails.list, function( index, email ){
        $inputGroup = $emailBsComponent.find( "div.input-group-add" ).clone();
        $inputGroup.removeClass( "input-group-add" );
        $inputGroup.find( "input:hidden[name=id]" ).val( email.id );
        $inputGroup.find( "input:text[name=emailAddress]" ).attr( "disabled", "" ).addClass( "emails-disabled" ).val( email.emailAddress );
        
        $inputGroup.find( "span.clkio-btn-add" ).hide();
        $inputGroup.find( "span.clkio-btn-upd-del" ).css( "display", "table-cell" );
        
        $emailBsComponent.append( $inputGroup );
    });
    
    $( "a.btn-emails-set-as-primary" ).click( { method : "PUT" }, clkio.settings.emails );
    $( "a.btn-emails-delete" ).click( { method : "DELETE" }, clkio.settings.emails );
}

clkio.settings.renderProfiles = function() {
    clkio.settings.change();
    $( "li#clkio-nav-pill-profiles" ).addClass( "active" );
    
}

clkio.settings.renderPassword = function() {
    clkio.settings.change();
    $( "li#clkio-nav-pill-password" ).addClass( "active" );
    
}

clkio.settings.emails = function( event ) {
	var data = {}, $panel;

	if ( event.data.method === "DELETE" && !confirm( "Delete record?" ) ) return;
    
    $panel = $( this ).parents( "div.input-group" );
    
    if ( event.data.method === "PUT" )
        data[ "primary" ] = true;
    
    data[ "emailAddress" ] = $panel.find( "input:text[name=emailAddress]" ).val();

	$panel.find( "input:text, button, a" ).attr( "disabled", "" );

	clkio.rest({
		uri : "/emails/" + ( event.data.method === "POST" ? "" : $panel.find( "input:hidden[name=id]" ).val() ),
		method : event.data.method,
		data : ( event.data.method === "DELETE" ? {} : JSON.stringify( data ) ),
		success : function() {
            clkio.emails.load( function() {
                clkio.settings.renderEmails();
            });
            $panel.find( "input:not(.emails-disabled), button, a" ).removeAttr( "disabled" );
		},
		error : function( xhr, status, error ) {
			console.log( {"xhr":xhr, "status":status, "error":error} );
			try {
				clkio.msgBox.error( "Sorry, but something went wrong;", JSON.parse( xhr.responseText ).message );
			} catch ( e ) {
				clkio.msgBox.error( "Sorry, but something went wrong;", error );
			}
			$panel.find( "input:not(.emails-disabled), button, a" ).removeAttr( "disabled" );
		}
	});
}

$( document ).ready( function(){
    
    // bind functions for nav pills
    $( "li#clkio-nav-pill-emails a" ).click( clkio.settings.renderEmails );
    $( "li#clkio-nav-pill-profiles a" ).click( clkio.settings.renderProfiles );
    $( "li#clkio-nav-pill-password a" ).click( clkio.settings.renderPassword );
    
    
    // prepare on change for settings
    clkio.settings.onChange = function() {
        $( "ul#clkio-nav-pill" ).find( "li" ).removeClass( "active" );
    }
    
    // load emaisl, as the default tab for settings
    clkio.emails.load( function() {
        clkio.settings.renderEmails();
    });
    
    // bind proper function to insert email
    $( "div.input-group-add" ).find( "span.clkio-btn-add" ).click( { method : "POST" }, clkio.settings.emails );
    
});