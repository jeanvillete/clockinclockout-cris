var clkio = window.clkio || {};
clkio.settings = {};
clkio.settings.onChange = function(){};

clkio.settings.change = function() {
	if ( clkio.settings.onChange )
			clkio.settings.onChange();
}

clkio.settings.renderEmails = function() {
    var $panelEmails = $( "#row-panel-emails div.bs-component" ),
        $formGroup = $panelEmails.find( "form.input-group-add" );
    
    // highlighting emails pill option
    clkio.settings.change();
    $( "li#clkio-nav-pill-emails" ).addClass( "active" );
    $( "#row-panel-emails" ).show();
    
    // clearing table
    $formGroup.siblings().remove();

    // clearing form for create/add, giving focus to its email address input
    $formGroup.find( "input:text[name=id]" ).val( "" )
    $formGroup.find( "input:text[name=emailAddress]" ).focus().val( "" );
    $formGroup.submit( clkio.emails.create );
    
    $.each( clkio.emails.list, function( index, email ){
        $formGroup = $panelEmails.find( "form.input-group-add" ).clone();
        $formGroup.removeClass( "input-group-add" ).addClass( "input-group-upd-del" );
        $formGroup.find( "input:hidden[name=id]" ).val( email.id );
        $formGroup.find( "input:text[name=emailAddress]" ).attr( "disabled", "" ).addClass( "keep-disabled" ).val( email.emailAddress );
        $formGroup.submit( function() { return false; } );
        
        $panelEmails.append( $formGroup );
    });
    
    $( "a.btn-emails-set-as-primary" ).click( clkio.emails.setAsPrimary );
    $( "a.btn-emails-delete" ).click( clkio.emails.delete );
}

clkio.settings.renderProfiles = function() {
    clkio.settings.change();
    $( "li#clkio-nav-pill-profiles" ).addClass( "active" );
    $( "#row-panel-profiles" ).show();
}

clkio.settings.renderPassword = function() {
    clkio.settings.change();
    $( "li#clkio-nav-pill-password" ).addClass( "active" );
    
}

$( document ).ready( function(){
    
    // bind functions for nav pills
    $( "li#clkio-nav-pill-emails a" ).click( clkio.settings.renderEmails );
    $( "li#clkio-nav-pill-profiles a" ).click( clkio.settings.renderProfiles );
    $( "li#clkio-nav-pill-password a" ).click( clkio.settings.renderPassword );
    
    // prepare on change for settings
    clkio.settings.onChange = function() {
        $( "ul#clkio-nav-pill" ).find( "li" ).removeClass( "active" );
        $( "#row-panel-emails, #row-panel-profiles, #row-panel-password" ).hide();
    }

    // prepare on change for emails and then,
    // invokes the loading for emails as it is the default 'form' to be shown on 'settings'
    clkio.emails.onChange = function() {
        clkio.emails.load( function() {
            clkio.settings.renderEmails();
        });
    };
    clkio.emails.change();

    // prepare on change for profiles
    clkio.profiles.onChange = function() {
        
    }
});