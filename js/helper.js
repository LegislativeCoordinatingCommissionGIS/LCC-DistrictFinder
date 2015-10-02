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

		if (map.hasLayer(tileLayer1)){
			map.removeLayer(tileLayer1);
			map.addLayer(tileLayer2);
		} else {
			map.removeLayer(tileLayer2);
			map.addLayer(tileLayer1);
		}
	})

	//map reset
	$('#map_reset').click(function(){
		map.setView(L.latLng(46.1706, -93.6678),6);
		//LATER SET ALL CHECKBOXES THIS WAY!!!
		if($('#satellitonoffswitch').is(':checked')){
			//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleLayers($('#satellitonoffswitch'),tileLayer2,tileLayer1);
			$('#satellitonoffswitch').prop('checked', true);
		}

	});

	//----- OPEN Modal
    $('[data-popup-open]').on('click', function(e)  {
        var targeted_popup_class = $(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
 
        e.preventDefault();
    });
 
    //----- CLOSE Modal
    $('[data-popup-close]').on('click', function(e)  {
    	console.log('clicked');
    	console.log(this);
        var targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
 
        e.preventDefault();
    });

});//end ready()


