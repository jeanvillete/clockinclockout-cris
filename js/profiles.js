var clkio = window.clkio || {};
clkio.profiles = {};
clkio.profiles.onChange = function(){};
clkio.profiles.list = [];

clkio.profiles.load = function( callback ) {
	clkio.rest({
		uri : "profiles",
		success : function( resp ) {
			clkio.profiles.list = resp.profiles || [];
			if ( callback ) callback();
		}
	});
}

clkio.profiles.change = function( onChange ) {
	if ( onChange ) {
		clkio.profiles.onChange = onChange;
		return onChange;
	}

	if ( typeof clkio.profiles.onChange === "function" )
		clkio.profiles.onChange();
}

clkio.profiles.uri = function() {
	return "profiles/" + Cookies.get( "profile" );
}

clkio.profiles.getCurrent = function() {
	return profile = $.grep( clkio.profiles.list, function( current ){
		return current.id == Cookies.get( "profile" );
	})[0];
}

clkio.profiles.getExpectedHours = function( day ) {
	var weekDay, profile, year, month, day;
	profile = clkio.profiles.getCurrent();
	if ( !profile ) {
		console.log( "[clkio.profiles.getExpectedHours] No profile found." );
		return null;
	}

	year = day.substring( profile.dateFormat.indexOf( "y" ), profile.dateFormat.lastIndexOf( "y" ) + 1 );
	month = day.substring( profile.dateFormat.indexOf( "M" ), profile.dateFormat.lastIndexOf( "M" ) + 1 );
	day = day.substring( profile.dateFormat.indexOf( "d" ), profile.dateFormat.lastIndexOf( "d" ) + 1 );
	weekDay = new Date( parseInt( year ), parseInt( month ) - 1, parseInt( day ) ).getDay();
	if ( weekDay === 0 ) return profile.expectedSunday;
	else if ( weekDay === 1 ) return profile.expectedMonday;
	else if ( weekDay === 2 ) return profile.expectedTuesday;
	else if ( weekDay === 3 ) return profile.expectedWednesday;
	else if ( weekDay === 4 ) return profile.expectedThursday;
	else if ( weekDay === 5 ) return profile.expectedFriday;
	else if ( weekDay === 6 ) return profile.expectedSaturday;

	console.log( "[clkio.profiles.getExpectedHours] Impossible infer value for expectedHours." );
	return null;
}

clkio.profiles.renderNavBar = function() {
	var $li, $a;
	$( "li.navbar-menu-profile" ).remove();

	$.each( clkio.profiles.list, function( index, profile ){
		$li = $( "<li></li>" ).addClass( "navbar-menu-profile" );
		$li.append( $( "<input></input>" ).attr( "type", "hidden" ).attr( "name", "id" ).attr( "value", profile.id ) );
		$a = $( "<a></a>" ).attr( "href", "#" );
		$a.append( document.createTextNode( profile.description ) );
		$a.append( $( "<i></i>" ).attr( "aria-hidden", "true" ).addClass( "fa" ) );
		$li.append( $a );

		if ( profile.id == Cookies.get( "profile" ) )
			clkio.profiles.selected( $li );

		$li.click( clkio.profiles.selected );
		$( "#navbar-menu-profile li.divider" ).before( $li );
	});
}

clkio.profiles.selected = function( $selected ) {
	var $li = this === clkio.profiles ? $selected : $( this );

	if ( this !== clkio.profiles && $li.find( "input:hidden[name=id]" ).val() === Cookies.get( "profile" ) )
		return;

	Cookies.set( "profile", $li.find( "input:hidden[name=id]" ).val() );

	$li.siblings().removeClass( "selected" );
	$li.parent().find( "li a i" ).removeClass( "fa-check" );

	$li.addClass( "selected" );
	$li.find( "a i" ).addClass( "fa-check" );

	clkio.profiles.change();
}

clkio.profiles.handleRow = function( $tr ) {
	var profile, $form = $( "#profile-form" );
	$tr = $( $tr.currentTarget );

	profile = $.grep( clkio.profiles.list, function( current ){
		return current.id == $tr.find( "td :hidden[name=id]" ).val();
	})[0];

	$form.find( ":hidden[name=id]" ).val( profile.id );
	$form.find( ":text[name=description]" ).val( profile.description );
	$form.find( ":text[name=dateFormat]" ).val( profile.dateFormat );
	$form.find( ":text[name=hoursFormat]" ).val( profile.hoursFormat );
	$form.find( ":text[name=expectedMonday]" ).val( profile.expectedMonday );
	$form.find( ":text[name=expectedTuesday]" ).val( profile.expectedTuesday );
	$form.find( ":text[name=expectedWednesday]" ).val( profile.expectedWednesday );
	$form.find( ":text[name=expectedThursday]" ).val( profile.expectedThursday );
	$form.find( ":text[name=expectedFriday]" ).val( profile.expectedFriday );
	$form.find( ":text[name=expectedSaturday]" ).val( profile.expectedSaturday );
	$form.find( ":text[name=expectedSunday]" ).val( profile.expectedSunday );

	$form.unbind().submit( clkio.profiles.update );

	$( "#clkio-profile-btn-delete" ).unbind().click( clkio.profiles.delete);

	$( ".clkio-profile-list" ).hide();
	$( ".clkio-profile-form, .form-onedit" ).show();

	clkio.settings.back( function(){
		$( ".clkio-profile-list" ).show();
		$( ".clkio-profile-form, .form-onedit" ).hide();
	});

	// load and render adjustings belonging to the current profile
	clkio.adjustings.load( clkio.adjustings.change, profile );

	// load and render reasons belonging to the current profile
	clkio.reasons.load( clkio.reasons.change, profile );
}

clkio.profiles.create = function( event ) {
	var form = clkio.forms( this ).serialize();
	event.preventDefault();
	form.data = $.extend( clkio.clone( clkio.profiles.getCurrent() ), form.data );
	form.data.id = 0;
	form.data.adjustings = [];
	form.data.reasons = [];
	clkio.rest({
        uri : "profiles",
        method : "POST",
        data : form.disable().dataAsString(),
        success : function( resp ) {
       		clkio.profiles.list.push( resp.domain );
        	clkio.profiles.change();
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.profiles.update = function( event ) {
	var form = clkio.forms( this ).serialize();
	event.preventDefault();
	clkio.rest({
        uri : "profiles/" + form.data.id,
        method : "PUT",
        data : form.disable().dataAsString(),
        success : function( resp ) {
        	var profile = $.grep( clkio.profiles.list, function( current ){
				return current.id == form.data.id;
			})[0];
        	$.extend( profile, form.data );
        	clkio.profiles.change();
        },
        complete : function() {
            form.enable();
        }
    });
}

clkio.profiles.delete = function() {
	var form = clkio.forms( "#profile-form" ).serialize();
	if ( !confirm( "Confirm delete record?" ) ) return;
	clkio.rest({
        uri : "profiles/" + form.disable().data.id,
        method : "DELETE",
        success : function() {
        	for ( var i = 0; i < clkio.profiles.list.length; i++ )
        		if ( clkio.profiles.list[i].id == form.data.id ) {
        			clkio.profiles.list.splice( i, 1 );
            		clkio.profiles.change();
            		clkio.settings.back();
            		break;
        		}
        },
        complete : function() {
            form.enable();
        }
    });
}