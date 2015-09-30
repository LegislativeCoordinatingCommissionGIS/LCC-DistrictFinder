$( document ).ready(function() {

	$( ".mnhouse, .mnsenate, .ushouse, .ussenate1, .ussenate2" ).click(function() {
	  $(this).addClass('active').siblings().removeClass('active');

	});

	$('#triangle-topright').click(function(){
  		$(this).animate({right:'-100px'},250, function(){
    		$('#map_layers').animate({right:0},250);
  		});  
	});

	$('#map_layers_toggle').click(function(){
  		$('#map_layers').animate({right:'-225px'},250, function(){
    		$('#triangle-topright').animate({right:0},250);
  		});  
	});

	//sat/vector toggle button callback
	var toggle = false;
	
	function togglePoints() {
	  if(!toggle) {
	    map.removeLayer(data1);
	  } else {
	    map.addLayer(data1);
	  }
	  toggle = !toggle;
	}

});//end ready()


