var clkio = window.clkio || {};
clkio.timecard = {};

clkio.timecard.updateBalance = function() {
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

clkio.timecard.updateMonthBalance = function() {
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

clkio.timecard.update = function() {
	var $timecard = $( "#tbl-timecard tbody" ), $tr, $td, $div, tdContent, $month = $( "#cmb-month" ), $year = $( "#cmb-year" ), strclkin, strclkout, balance;
	$timecard.empty();
	clkio.rest({
		uri : clkio.profiles.uri() + "/timecard/" + $year.val() + "-" + $month.val(),
		success : function( resp ) {
			$.each( resp.timeCard.days, function( index, value ){
				$tr = $( "<tr></tr>" );
				$tr.append( $( "<input></input>" ).attr( "type", "hidden" ).attr( "name", "data" ).attr( "value", JSON.stringify( value ) ) );
				$tr.click( clkio.timecard.handleRow );

				$tr.append( $( "<td></td>" ).text( value.date ) );

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
	});
}

clkio.timecard.handleRow = function( $tr ) {
	$tr = $( $tr.currentTarget );
	var $timecardForm = $( "#timecard-form" ), $tblClios = $( "#tbl-clkios tbody" ), $tblMnlEnterings = $( "#tbl-manualenterings tbody" ), day, $hdEnterings, $identifiers, $hdId, $clockins, $hdClockin, $clockouts, $hdClockout, $tr, $td;

	if ( $tr.hasClass( "date-selected" ) ) {
		$tr.removeClass( "date-selected" );
		$tr.siblings().show();
		$timecardForm.hide();
		$tblClios.empty();
		$tblMnlEnterings.empty();
	} else {
		$tr.addClass( "date-selected" );
		$tr.siblings().hide();

		day = JSON.parse( $tr.find( ":hidden[name=data]" ).val() );

		// load expected hours
		$timecardForm.find( "#txtb-expected" ).val( day.expectedHours ? day.expectedHours : "" );

		// load notes
		$timecardForm.find( "#txta-notes" ).val( day.notes ? day.notes : "" );

		// load clockins clockouts
		$.each( day.tableEntering, function( index, clockinclockout ){
			if ( !clockinclockout.clockin && !clockinclockout.clockout ) return;
			clockinclockout.clockin = clockinclockout.clockin ? clockinclockout.clockin : "";
			clockinclockout.clockout = clockinclockout.clockout ? clockinclockout.clockout : "";
			$tr = $( "<tr></tr>" );

			// clockin
			$td = $( "<td></td>" ).text( clockinclockout.clockin );
			$td.append( $( "<input></input>" ).attr( "type", "hidden" ).attr( "name", "id" ).attr( "value", clockinclockout.id ) );
			$tr.append( $td );

			// clockout
			$td = $( "<td></td>" ).text( clockinclockout.clockout );
			$tr.append( $td );

			// clockin/clockout button edit
			$td = $( "<td></td>" );
			$td.append( clkio.grid.getButton( "edit", function(){
				alert( "bla" );
			}) );

			// clockin/clockout button remove
			$td.append( clkio.grid.getButton( "remove", function(){
				alert( "bla" );
			}) );
			$tr.append( $td );

			$tblClios.append( $tr );
		});
		$( "#txtb-clockin-dt" ).val( day.date );
		$( "#txtb-clockout-dt" ).val( day.date );

		// load manualenterings
		if ( !$( "#cmb-mnl-reason option" ).length ){
			clkio.reasons.list( function( resp ) {
				$.each( resp.reasons, function( index, reason ){
					$( "#cmb-mnl-reason" ).append( $( "<option></option>" ).attr( "value", reason.id ).text( reason.reason ) );
				});
			});
		}
		$.each( day.tableEntering, function( index, manualEnterings ){
			if ( !manualEnterings.reason ) return;
			$tr = $( "<tr></tr>" );

			$td = $( "<td></td>" );
			$td.text( manualEnterings.reason.reason );
			$td.append( $( "<input></input>" ).attr( "type", "hidden" ).attr( "name", "id" ).attr( "value", manualEnterings.id ) );
			$td.append( $( "<input></input>" ).attr( "type", "hidden" ).attr( "name", "reason.id" ).attr( "value", manualEnterings.reason.id ) );
			$tr.append( $td );

			// manualentering button edit
			$td = $( "<td></td>" );
			$td.append( clkio.grid.getButton( "edit", function(){
				alert( "bla" );
			}) );

			// manualentering button remove
			$td.append( clkio.grid.getButton( "remove", function(){
				alert( "bla" );
			}) );
			$tr.append( $td );

			$tblMnlEnterings.append( $tr );
		});

		$timecardForm.show();
	}
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
		clkio.timecard.updateMonthBalance();
		clkio.timecard.update();
	});

	// prepare combo for years
	for ( year = 2010; year <= today.getFullYear(); year ++ )
		years.push( year );
	$.each( years, function( index, value ){
		$year.append( $( "<option></option>" ).attr( "value", value ).text( value ) );
	});
	$year.val( today.getFullYear() );
	$year.change(function(){
		clkio.timecard.updateMonthBalance();
		clkio.timecard.update();
	});

	// load and setup profiles
	clkio.profiles.list( function( resp ){
		$.each( resp.profiles, function( index, value ){
			$profile.append( $( "<option></option>" ).attr( "value", value.id ).text( value.description ) );
			$profile.val( Cookies.get( "profile" ) );
		})
	});
	$profile.change( function( data ){
		Cookies.set( "profile", $profile.val() );
		clkio.timecard.updateBalance();
		clkio.timecard.updateMonthBalance();
		clkio.timecard.update();
	});

	// shows current logged user
	$user.empty().text( Cookies.get( "user" ) + " " ).append( $( "<span></span>" ).attr( "class", "caret" ) );

	// load total balance
	clkio.timecard.updateBalance();

	// load total balance for the month
	clkio.timecard.updateMonthBalance();

	// load timecard
	clkio.timecard.update();
});
