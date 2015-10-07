$( document ).ready(function() {
    
    //mobile search form
    if ($(window).width() < 417){
    	$('.smallscreen').show();
    } else {
		$('.smallscreen').hide();
    }

    //hide links - format is off until results come back
    $('.memberLink').hide();

	//Members UI click turn red with 'active' class
	$( ".mnhouse, .mnsenate, .ushouse, .ussenate1, .ussenate2" ).click(function() {
	  $(this).addClass('active').siblings().removeClass('active');

	});

	//Open layers tab
	$('#triangle-topright').click(function(){
  		$(this).animate({right:'-100px'},250, function(){
    		$('#map_layers').animate({right:0},250);
  		});  
	});

    //Close layers tab
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
		map.eachLayer(function(layer){
		//Remove old layer
		if (typeof layer._url === "undefined"){
			map.removeLayer(layer);
		}
	});
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
        var targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
 
        e.preventDefault();
    });

    //attach a hover method to layers ribbon
    $('#triangle-topright').on('mouseenter', function(){
    	$('.fa-map').css('color', '#346f9a'); 
    }).on('mouseleave', function(){
    	$('.fa-map').css('color', '#8d8d8d');
    });

    //map navigation, this could become aswitch
    map.on('click', function(e){
    	addMarker(e);
		identifyDistrict(e);
		
	});


});//end ready()


