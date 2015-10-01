$( document ).ready(function() {

	//Members UI click turn red with 'active' class
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
	
	//Toggle basemap
	$('#satellitonoffswitch').click(function(){
		console.log('selected switch');
		if (map.hasLayer(tileLayer1)){
			map.removeLayer(tileLayer1);
			map.addLayer(tileLayer2);
		} else {
			map.removeLayer(tileLayer2);
			map.addLayer(tileLayer1);
		}
	})

});//end ready()


