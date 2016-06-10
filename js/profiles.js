var clkio = window.clkio || {};
clkio.profiles = {};
clkio.profiles.onChange = {};
clkio.profiles.list = [];

clkio.profiles.load = function( callback ) {
	clkio.rest({
		async : false,
		uri : "profiles",
		success : function( resp ) {
			clkio.profiles.list = resp.profiles || [];
			if ( callback ) callback();
			clkio.profiles.change();
		}
	});
}

clkio.profiles.change = function() {
	if ( clkio.profiles.onChange )
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
		$li.append( $a );

		if ( profile.id == Cookies.get( "profile" ) )
			clkio.profiles.selected( $li );

		$li.click( clkio.profiles.selected );
		$( "li#navbar-menu-profile" ).after( $li );
	});
}

clkio.profiles.selected = function( $selected ) {
	var $li = this === clkio.profiles ? $selected : $( this );

	if ( this !== clkio.profiles && $li.find( "input:hidden[name=id]" ).val() === Cookies.get( "profile" ) )
		return;

	Cookies.set( "profile", $li.find( "input:hidden[name=id]" ).val() );

	$li.siblings().removeClass( "selected" );
	$li.parent().find( "li a i" ).remove();

	$li.addClass( "selected" );
	$li.find( "a" ).append( $( "<i></i>" ).attr( "aria-hidden", "true" ).attr( "class", "fa fa-dot-circle-o" ) );

	clkio.profiles.change();
}
