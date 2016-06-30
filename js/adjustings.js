var clkio = window.clkio || {};
clkio.adjustings = {};
clkio.adjustings.onChange = function(){};
clkio.adjustings.list = [];

clkio.adjustings.change = function( onChange ) {
	if ( onChange ) {
		clkio.adjustings.onChange = onChange;
		return onChange;
	}

	if ( typeof clkio.adjustings.onChange === "function" )
		clkio.adjustings.onChange();
}

clkio.adjustings.load = function( callback, profileId ) {
	clkio.rest({
		uri : "profiles/" + profileId || "" + "/adjustings",
		success : function( resp ) {
			clkio.adjustings.list = resp.adjustings || [];
			if ( callback ) callback();
		}
	});
}

clkio.adjustings.create = function( event ) {
	var form = clkio.forms( this ).serialize(),
		profileId = $( "#profile-form :hidden[name=id]" ).val();
	event.preventDefault();
	clkio.rest({
        uri : "profiles/" + profileId || "" + "/adjustings",
        method : "POST",
        data : form.disable().dataAsString(),
        success : function( resp ) {
       		clkio.adjustings.list.push( resp.domain );
        	clkio.adjustings.change();
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.adjustings.update = function( event ) {
		profileId = $( "#profile-form :hidden[name=id]" ).val();
	event.preventDefault();
	clkio.rest({
        uri : "profiles/" + profileId || "" + "/adjustings/" + form.data.id,
        method : "PUT",
        data : form.disable().dataAsString(),
        success : function( resp ) {
        	var adjusting = $.grep( clkio.adjustings.list, function( current ){
				return current.id == form.data.id;
			})[0];
        	$.extend( adjusting, form.data );
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.adjustings.delete = function() {
	var form = clkio.forms( $( this ).parents( "form.input-group" ) ).serialize(),
		profileId = $( "#profile-form :hidden[name=id]" ).val();
	if ( !confirm( "Confirm delete record?" ) ) return;
	clkio.rest({
        uri : "profiles/" + profileId || "" + "/adjustings/" + form.disable().data.id,
        method : "DELETE",
        success : function() {
        	for ( var i = 0; i < clkio.adjustings.list.length; i++ )
        		if ( clkio.adjustings.list[i].id == form.data.id ) {
        			clkio.adjustings.list.splice( i, 1 );
            		clkio.adjustings.change();
            		break;
        		}
        }
    });
}
