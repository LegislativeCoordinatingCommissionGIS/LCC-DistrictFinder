$( document ).ready(function() {

	$( ".search,.mnhouse, .mnsenate, .ushouse, .ussenate1, .ussenate2" ).click(function() {
	  $(this).addClass('active').siblings().removeClass('active');

	});
});