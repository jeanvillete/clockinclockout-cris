var clkio = window.clkio || {};
clkio.reasons = {};
clkio.reasons.list = [];

clkio.reasons.change = function( onChange ) {
	if ( onChange ) {
		clkio.reasons.onChange = onChange;
		return onChange;
	}

	if ( typeof clkio.reasons.onChange === "function" )
		clkio.reasons.onChange();
}

clkio.reasons.load = function( callback, profile ) {
	clkio.reasons.list = profile.reasons;
	if ( callback ) callback();
}

clkio.reasons.create = function( event ) {
	var form = clkio.forms( this ).serialize(),
		profileId = $( "#profile-form :hidden[name=id]" ).val();
	event.preventDefault();
	clkio.rest({
        uri : "profiles/" + profileId + "/reasons",
        method : "POST",
        data : form.disable().dataAsString(),
        success : function( resp ) {
       		clkio.reasons.list.push( resp.domain );
            form.enable();
            clkio.reasons.change();
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.reasons.update = function( event ) {
    var form = clkio.forms( this ).serialize(),
		profileId = $( "#profile-form :hidden[name=id]" ).val();
	event.preventDefault();
	clkio.rest({
        uri : "profiles/" + profileId + "/reasons/" + form.data.id,
        method : "PUT",
        data : form.disable().dataAsString(),
        success : function( resp ) {
        	var reason = $.grep( clkio.reasons.list, function( current ){
				return current.id == form.data.id;
			})[0];
        	$.extend( reason, form.data );
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.reasons.delete = function() {
	var form = clkio.forms( $( this ).parents( "form.input-group" ) ).serialize(),
		profileId = $( "#profile-form :hidden[name=id]" ).val();
	if ( !confirm( "Confirm delete record?" ) ) return;
	clkio.rest({
        uri : "profiles/" + profileId + "/reasons/" + form.disable().data.id,
        method : "DELETE",
        success : function() {
        	for ( var i = 0; i < clkio.reasons.list.length; i++ )
        		if ( clkio.reasons.list[i].id == form.data.id ) {
        			clkio.reasons.list.splice( i, 1 );
            		clkio.reasons.change();
            		break;
        		}
        }
    });
}
