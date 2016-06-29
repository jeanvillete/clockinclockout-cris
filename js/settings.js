var clkio = window.clkio || {};
clkio.settings = {};
clkio.settings.onChange = function(){};

clkio.settings.change = function( onChange ) {
    if ( onChange ) {
        clkio.settings.onChange = onChange;
        return onChange;
    }

	if ( typeof clkio.settings.onChange === "function" )
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
    $formGroup.find( "input:text[name=emailAddress]" ).val( "" );
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
    var $panelProfiles = $( "#row-panel-emails div.bs-component" ),
        $formGroup = $panelProfiles.find( "form.input-group-add" ),
        $profiles = $( "#tbl-profiles tbody" ),
        $tr;

    // highlighting emails pill option
    clkio.settings.change();
    $( "li#clkio-nav-pill-profiles" ).addClass( "active" );
    $( "#row-panel-profiles" ).show();

    $formGroup.find( "input:text[name=description]" ).val( "" );
    $formGroup.submit( clkio.profiles.create );

    // clearing table
    $profiles.empty();
    $.each( clkio.profiles.list, function( index, profile ){
        $tr = $( "<tr></tr>" );

        $tr.append( $( "<td></td>" ).text( profile.description ) );
        $tr.append( $( "<td></td>" ).attr( "class", "not_for_small" ).text( profile.dateFormat ) );
        $tr.append( $( "<td></td>" ).attr( "class", "not_for_small" ).text( profile.hoursFormat ) );

        $profiles.append( $tr );
    });
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
    clkio.settings.change( function() {
        $( "ul#clkio-nav-pill" ).find( "li" ).removeClass( "active" );
        $( "#row-panel-emails, #row-panel-profiles, #row-panel-password" ).hide();
    });

    // prepare on change for emails and then,
    // invokes the loading for emails as it is the default 'form' to be shown on 'settings'
    clkio.emails.load(
        clkio.emails.change( function() {
            clkio.settings.renderEmails();
        })
    );

    // load and prepare on change for profiles
    clkio.profiles.load( function(){
        if ( !Cookies.get( "profile" ) )
            Cookies.set( "profile", clkio.profiles.list[0].id );
        //clkio.profiles.renderNavBar();

        clkio.profiles.change( clkio.settings.renderProfiles );
    });
});