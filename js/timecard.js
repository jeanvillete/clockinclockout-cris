var clkio = window.clkio || {};
clkio.timecard = {};

clkio.timecard.updateBalance = function() {
	var $balance = $( "#d-balance" );
	clkio.rest({
		uri : clkio.profiles.uri() + "/timecard/totaltime",
		success : function( resp ) {
			if ( resp.totalTime.charAt( 0 ) == "-" ) {
				$balance.parent().parent().removeClass( "panel-primary" ).addClass( "panel-danger" );
			} else {
				$balance.parent().parent().removeClass( "panel-danger" ).addClass( "panel-primary" );
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
				$monthBalance.parent().parent().removeClass( "panel-primary" ).addClass( "panel-danger" );
			} else {
				$monthBalance.parent().parent().removeClass( "panel-danger" ).addClass( "panel-primary" );
			}
			$monthBalance.text( resp.totalTimeMonthly );
		}
	});
}

clkio.timecard.update = function() {
	var $timecard = $( "#tbl-timecard tbody" ), $tr, tdContent, $month = $( "#cmb-month" ), $year = $( "#cmb-year" ), strclkin, strclkout, balance;
	$timecard.empty();
	clkio.rest({
		uri : clkio.profiles.uri() + "/timecard/" + $year.val() + "-" + $month.val(),
		success : function( resp ) {
			$.each( resp.timeCard.days, function( index, value ){
				balance = value.balance ? value.balance.trim() : "";

				$tr = $( "<tr></tr>" );
				if ( balance.charAt( 0 ) == "-" ) {
					$tr.attr( "class", "danger" );
				} else if ( balance.length > 0 ) {
					$tr.attr( "class", "success" );
				}

				$tr.append( $( "<td></td>" ).text( value.date ) );
				tdContent = "";
				$.each( value.tableEntering, function( tIndex, tValue ){
					if ( tValue.reason ) {
						tdContent += "[ " + tValue.reason.reason + " " + tValue.timeInterval + " ]";
					} else if ( tValue.clockin || tValue.clockout ) {
						strclkin = ( tValue.clockin ? tValue.clockin.trim() : "?" ), strclkout = ( tValue.clockout ? tValue.clockout.trim() : "?" );
						strclkin = strclkin.substring( strclkin.indexOf( " " ) );
						strclkout = strclkout.substring( strclkout.indexOf( " " ) );

						tdContent += "[ " + strclkin + " - " + strclkout + " ]";
					}
				});
				$tr.append( $( "<td></td>" ).text( tdContent ) );
				$tr.append( $( "<td></td>" ).text( value.expectedHours ? value.expectedHours : "" ) );
				$tr.append( $( "<td></td>" ).text( balance ) );
				$tr.append( $( "<td></td>" ).text( value.notes ? value.notes : "" ) );
				$timecard.append( $tr );
			});
		}
	});
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
		})
		$profile.val( Cookies.get( "profile" ) );
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
