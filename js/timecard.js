var clkio = window.clkio || {};
clkio.timecard = {};
clkio.timecard.onChange = function(){};
clkio.timecard.data = {};

clkio.timecard.load = function( callback ) {
	clkio.rest({
		uri : clkio.profiles.uri() + "/timecard/" + $( "#cmb-year" ).val() + "-" + $( "#cmb-month" ).val(),
		success : function( resp ) {
			clkio.timecard.data = resp.timeCard || {};
			if ( callback ) callback();
			clkio.timecard.change();
		}
	});
}

clkio.timecard.change = function() {
	if ( clkio.timecard.onChange )
			clkio.timecard.onChange();
}

clkio.timecard.renderTotalBalance = function() {
	var $balance = $( "#d-balance" );
	clkio.rest({
		uri : clkio.profiles.uri() + "/timecard/totaltime",
		success : function( resp ) {
			if ( resp.totalTime.charAt( 0 ) == "-" ) {
				$balance.parent().parent().removeClass( "panel-primary" ).addClass( "panel-warning" );
			} else {
				$balance.parent().parent().removeClass( "panel-warning" ).addClass( "panel-primary" );
			}
			$balance.text( resp.totalTime );
		}
	});
}

clkio.timecard.renderMonthBalance = function() {
	var $monthBalance = $( "#d-balanceMonthly" ), $month = $( "#cmb-month" ), $year = $( "#cmb-year" );
	clkio.rest({
		uri : clkio.profiles.uri() + "/timecard/totaltime/" + $year.val() + "-" + $month.val(),
		success : function( resp ) {
			if ( resp.totalTimeMonthly.charAt( 0 ) == "-" ) {
				$monthBalance.parent().parent().removeClass( "panel-primary" ).addClass( "panel-warning" );
			} else {
				$monthBalance.parent().parent().removeClass( "panel-warning" ).addClass( "panel-primary" );
			}
			$monthBalance.text( resp.totalTimeMonthly );
		}
	});
}

clkio.timecard.renderTable = function() {
	var $timecard = $( "#tbl-timecard tbody" ), $tr, $td, $div, tdContent, $month = $( "#cmb-month" ), $year = $( "#cmb-year" ), strclkin, strclkout, balance;
	$timecard.empty();
	$.each( clkio.timecard.data.days, function( index, value ){
		$tr = $( "<tr></tr>" );
		$tr.click( clkio.timecard.handleRow );

		// date
		$tr.append( $( "<td></td>" ).text( value.date ).append( $( "<input></input>" ).attr( "type", "hidden" ).attr( "name", "date" ).attr( "value", value.date ) ) );

		// clockin/clockout or manualentering
		$td = $( "<td></td>" );
		$.each( value.tableEntering, function( tIndex, tValue ){
			$div = $( "<div></div>" ).attr( "class", "label" );

			if ( tValue.reason ) {
				$div.addClass( "label-primary" ).text( tValue.reason.reason + " " + tValue.timeInterval );
			} else if ( tValue.clockin || tValue.clockout ) {
				strclkin = ( tValue.clockin ? tValue.clockin.trim() : "?" ), strclkout = ( tValue.clockout ? tValue.clockout.trim() : "?" );
				strclkin = strclkin.substring( strclkin.indexOf( " " ) );
				strclkout = strclkout.substring( strclkout.indexOf( " " ) );

				$div.addClass( !tValue.clockin || !tValue.clockout ? "label-warning" : "label-success" ).text( strclkin + " - " + strclkout );
			}
			$td.append( $div );
		});
		$tr.append( $td );

		// expectedHours
		$td = $( "<td></td>" ).attr( "class", "not_for_small" ).text( value.expectedHours ? value.expectedHours : "" );
		$tr.append( $td );

		// balance
		$tr.append( $( "<td></td>" ).text( value.balance ? value.balance.trim() : "" ) );

		// notes
		$tr.append( $( "<td></td>" ).attr( "class", "not_for_small" ).text( value.notes ? value.notes : "" ) );

		// add tr to the table
		$timecard.append( $tr );
	});
}

clkio.timecard.handleRow = function( $tr ) {
	$tr = $( $tr.currentTarget );
	var $clkioGroup, $mnlGroup, day, $tr;

	if ( $tr.hasClass( "date-selected" ) ) {
		$tr.removeClass( "date-selected" );
		$tr.siblings().show();

		$( "#clkio-input-group-add" ).show();
	} else {
		$tr.addClass( "date-selected" );
		$tr.siblings().hide();

		day = $.grep( clkio.timecard.data.days, function( current ){
			return current.date == $tr.find( "td :hidden[name=date]" ).val();
		})[0];

		clkio.timecard.fillForm( day );
	}
}

clkio.timecard.fillForm = function( day ) {
	// date (day)
	$( "#txtb-day-dt" ).val( day.date );

	// balance
	$( "#txtb-balance" ).val( day.balance );

	// load expected hours
	$( "#txtb-expected" ).val( day.expectedHours || clkio.profiles.getExpectedHours( day.date ) );

	// load notes
	$( "#txtb-notes" ).val( day.notes ? day.notes : "" );

	// clear form for clockins and clockouts
	$( "#clkio-input-group-add" ).siblings().remove();

	// clear form for manual enterings
	$( "#mnl-entering-input-group-add" ).siblings().remove();

	// load clockins clockouts
	$.each( day.tableEntering, function( index, clockinclockout ){
		if ( !clockinclockout.clockin && !clockinclockout.clockout ) return;
		clockinclockout.clockin = clockinclockout.clockin || "";
		clockinclockout.clockout = clockinclockout.clockout || "";

		$clkioGroup = $( "#clkio-input-group-add" ).clone();
		$clkioGroup.attr( "id", "" );
		$clkioGroup.removeClass( "input-group-add" );

		// clkio-id
		$clkioGroup.find( "input:hidden[name=clkio-id]" ).val( clockinclockout.id );

		// clockin
		$clkioGroup.find( "input:text[name=clockin-hr]" ).val( clockinclockout.clockin.substring( clockinclockout.clockin.indexOf( " " ) ) );

		// clockout
		$clkioGroup.find( "input:text[name=clockout-hr]" ).val( clockinclockout.clockout.substring( clockinclockout.clockout.indexOf( " " ) ) );

		$clkioGroup.find( "span.clkio-add-btn" ).hide();
		$clkioGroup.find( "span.clkio-uptdel-btn" ).css( "display", "table-cell" );

		$( "#clkio-input-group-add" ).parent().append( $clkioGroup );
	});

	$.each( day.tableEntering, function( index, manualEnterings ){
		if ( !manualEnterings.reason ) return;

		$mnlGroup = $( "#mnl-entering-input-group-add" ).clone();
		$mnlGroup.attr( "id", "" );
		$mnlGroup.removeClass( "input-group-add" );

		// mnl-id
		$mnlGroup.find( "input:text[name=mnl-id]" ).val( manualEnterings.id );

		// reason
		$mnlGroup.find( "select[name=mnl-reason]" ).val( manualEnterings.reason.id );

		// time interval
		$mnlGroup.find( "input:text[name=mnl-timeinterval]" ).val( manualEnterings.timeInterval );

		$mnlGroup.find( "span.mnl-enterings-add-btn" ).hide();
		$mnlGroup.find( "span.mnl-enterings-uptdel-btn" ).css( "display", "table-cell" );

		$( "#mnl-entering-input-group-add" ).parent().append( $mnlGroup );
	});

	// masking
	$( "input[type=text].clkio-time" ).unmask();
	$( "input[type=text].clkio-date" ).unmask()
	$( "input[type=text].clkio-time" ).mask( "00:00" );
	$( "input[type=text].clkio-date" ).mask( clkio.profiles.getCurrent().dateFormat.replace( /y|M|d/g, "0" ) );
}

$( document ).ready( function(){
	var today = new Date(),
		year, years = [],
		$year = $( "#cmb-year" ),
		months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		$month = $( "#cmb-month" ),
		$profile = $( "#cmb-profile" ),
		$user = $( "#d-email" );

	// prepare combo for months
	$.each( months, function( index, value ){
		var optionValue = ( index + 1 ).toString();
		optionValue = optionValue.length === 2 ? optionValue : "0" + optionValue;
		$month.append( $( "<option></option>" ).attr( "value", optionValue ).text( value ) );
		if ( today.getMonth() === index ) $month.val( optionValue );
	});
	$month.change(function(){
		clkio.timecard.load();
	});

	// prepare combo for years
	for ( year = 2010; year <= today.getFullYear(); year ++ )
		years.push( year );
	$.each( years, function( index, value ){
		$year.append( $( "<option></option>" ).attr( "value", value ).text( value ) );
	});
	$year.val( today.getFullYear() );
	$year.change(function(){
		clkio.timecard.load();
	});

	// shows current logged user
	$user.empty().text( Cookies.get( "user" ) + " " ).append( $( "<span></span>" ).attr( "class", "caret" ) );

	// setup onChange for timecard, when timecard is loaded/reloaded
	clkio.timecard.onChange = function() {
		clkio.timecard.renderTotalBalance();
		clkio.timecard.renderMonthBalance();
		clkio.timecard.renderTable();
	}

	// load and setup profiles
	clkio.profiles.onChange = function(){
		clkio.timecard.load();

		// load manualenterings
		clkio.reasons.load( function() {
			$.each( clkio.reasons.list, function( index, reason ){
				$( ".cmb-mnl-reason" ).append( $( "<option></option>" ).attr( "value", reason.id ).text( reason.reason ) );
			});
		});

		$( "select.cmb-mnl-reason option:not(:first)" ).remove();
	};
	clkio.profiles.load( function(){
		$.each( clkio.profiles.list, function( index, profile ){
			$profile.append( $( "<option></option>" ).attr( "value", profile.id ).text( profile.description ) );
			if ( !Cookies.get( "profile" ) )
				Cookies.set( "profile", clkio.profiles.list[0].id );
			$profile.val( Cookies.get( "profile" ) );
		});
	});
	$profile.change( function( data ){
		Cookies.set( "profile", $profile.val() );
		clkio.profiles.change();
	});
});
