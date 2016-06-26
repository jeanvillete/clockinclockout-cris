var clkio = window.clkio || {};
clkio.emails = {};
clkio.emails.onChange = function(){};
clkio.emails.list = [];

clkio.emails.change = function() {
	if ( clkio.emails.onChange )
		clkio.emails.onChange();
}

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

clkio.emails.create = function( event ) {
    var form = clkio.forms( this ).serialize();
    event.preventDefault();
    clkio.rest({
        uri : "emails",
        method : "POST",
        data : form.disable().dataAsString(),
        success : function() {
            clkio.emails.load( function() {
                clkio.settings.renderEmails();
            });
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.emails.setAsPrimary = function() {
    var form = $( this ).parents( "form.input-group" );
    if ( !confirm( "Are you sure you want set this record as primary?" ) ) return;
    form.find( "input:hidden[name=primary]" ).val( 'true' );
    form = clkio.forms( form ).serialize();
    clkio.rest({
        uri : "emails/" + form.data.id,
        method : "PUT",
        data : form.dataAsString(),
        success : function() {
            clkio.emails.load( function() {
                clkio.settings.renderEmails();
            });
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.emails.delete = function() {
    var form = clkio.forms( $( this ).parents( "form.input-group" ) ).serialize();
    if ( !confirm( "Confirm delete record?" ) ) return;
    clkio.rest({
        uri : "emails/" + form.data.id,
        method : "DELETE",
        success : function() {
            clkio.emails.load( function() {
                clkio.settings.renderEmails();
            });
        }
    });
}