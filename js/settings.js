var clkio = window.clkio || {};
clkio.settings = {};
clkio.settings.onChange = function(){};

clkio.settings.change = function() {
	if ( clkio.settings.onChange )
			clkio.settings.onChange();
}

clkio.settings.renderEmails = function() {
    var $emailBsComponent = $( "#row-panel-emails div.bs-component" ), $inputGroup;
    
    clkio.settings.change();
    $( "li#clkio-nav-pill-emails" ).addClass( "active" );
    
    $emailBsComponent.find( "div.input-group-add" ).siblings().remove();
    
    $.each( clkio.emails.list, function( index, email ){
        $inputGroup = $emailBsComponent.find( "div.input-group-add" ).clone();
        $inputGroup.removeClass( "input-group-add" );
        $inputGroup.find( "input:hidden[name=id]" ).val( email.id );
        $inputGroup.find( "input:text[name=emailAddress]" ).attr( "disabled", "" ).val( email.emailAddress );
        
        $inputGroup.find( "span.clkio-add-btn" ).hide();
        $inputGroup.find( "span.btn-update-delete" ).css( "display", "table-cell" );
        
        $emailBsComponent.append( $inputGroup );
    });
}

clkio.settings.renderProfiles = function() {
    clkio.settings.change();
    $( "li#clkio-nav-pill-profiles" ).addClass( "active" );
    
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
    }
    
    // load emaisl, as the default tab for settings
    clkio.emails.load( function() {
        clkio.settings.renderEmails();
    });
    
});