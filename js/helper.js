$( document ).ready(function() {
	//kickoff map logic
    initialize();

    //map navigation, this could become as witch
    map.on('click', function(e){
    	addMarker(e);
		identifyDistrict(e);		
	});

    //mobile search form #RWD
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
	  //console.log($(this).attr('class'));
	  showDistrict($(this).attr('class'));

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
	});

	$('#countyonoffswitch, #cononoffswitch, #ssonoffswitch, #shonoffswitch').click(function(){
		//console.log(typeof($(this).attr('id')));
        //toggleOverlayLayers($(this).attr('id'));
        toggleOverlayLayers($(this), $(this).attr('id'));

	});

    //to improve performance, I am not loading municipal boundaries until called upon by user
    $('#cityonoffswitch').click(function(){
    	$('#loading').show();
		//getCityLayersGeoJson();
		if(typeof CityBoundaryLayer === 'undefined'){
			$.getJSON("./data/MCD2010.json", function(data) {
				var countyStyle = {
					"fill":0,
    				"color": "#231f20",
    				"weight": 1,
    				"pacity": 0.65
					};
					CityBoundaryLayer = L.geoJson(data, {style:countyStyle});		
			 
				}).done(function(){
					$('#loading').hide(); 
					toggleOverlayLayers($('#cityonoffswitch'), $('#cityonoffswitch').attr('id'));
				});
		} else {
			//console.log('here');
			toggleOverlayLayers($('#cityonoffswitch'), $('#cityonoffswitch').attr('id'));
			$('#loading').hide();
		}
	});


	//map reset
	$('#map_reset').click(function(){
		map.setView(L.latLng(46.1706, -93.6678),6);
		map.eachLayer(function(layer){
			//Remove map layers
			if (typeof layer._url === "undefined"){
				map.removeLayer(layer);
			}
			//remove sidebar formatting
			$( ".mnhouse, .mnsenate, .ushouse, .ussenate1, .ussenate2" ).removeClass('active');
			$('.memberLink').hide();
			$('#housemember, #senatemember, #ushousemember, #ussenatemember, #ussenatemember2').html('');
		    $('#housedistrict, #senatedistrict, #ushousedistrict, #ussenatedistrict, #ussenatedistrict2').html('');
		    $('#housephoto, #senatephoto, #ushousephoto, #ussenatephoto, #ussenatephoto2').removeAttr('src');
		});

		//Toggle basemap when you reset -- LATER SET ALL CHECKBOXES THIS WAY!!!
		//verbose, should do this cleaner
		if($('#satellitonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleLayers($('#satellitonoffswitch'),tileLayer2,tileLayer1);
			$('#satellitonoffswitch').prop('checked', true);
		}
		// reset additional layers too
		if($('#countyonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleOverlayLayers($('#countyonoffswitch'), $('#countyonoffswitch').attr('id'));
			$('#countyonoffswitch').prop('checked', true);
		}
		if($('#cityonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleOverlayLayers($('#cityonoffswitch'), $('#cityonoffswitch').attr('id'));
			$('#cityonoffswitch').prop('checked', true);
		}
		if($('#cononoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleOverlayLayers($('#cononoffswitch'), $('#cononoffswitch').attr('id'));
			$('#cononoffswitch').prop('checked', true);
		}
		if($('#ssonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleOverlayLayers($('#ssonoffswitch'), $('#ssonoffswitch').attr('id'));
			$('#ssonoffswitch').prop('checked', true);
		}
		if($('#shonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleOverlayLayers($('#shonoffswitch'), $('#shonoffswitch').attr('id'));
			$('#shonoffswitch').prop('checked', true);
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

    


});//end ready()

$(window).load(function(){
   // code here
    //getCountyLayersGeoJson();
    $.getJSON("./data/County2010.json", function(data) {
		var countyStyle = {
		"fill":0,
    	"color": "#231f20",
    	"weight": 4,
    	"opacity": 0.65
	};
		CountyBoundaryLayer = L.geoJson(data, {style:countyStyle});
  });

	//getHSELayersGeoJson();
	$.getJSON("./data/HSE2012.json", function(data) {
		var countyStyle = {
		"fill":0,
    	"color": "#ff6600",
    	"dashArray":"7,7",
    	"weight": 2,
    	"opacity": 0.65
	};
		StateHouseLayer = L.geoJson(data, {style:countyStyle});
  });

	//getCongLayersGeoJson();
	$.getJSON("./data/Cong2012.json", function(data) {
		var countyStyle = {
		"fill":0,
    	"color": "#ff3399",
    	"weight": 2,
    	"opacity": 0.65
	};
		CongressionalLayer = L.geoJson(data, {style:countyStyle});
  })
	//getSenLayersGeoJson();
	$.getJSON("./data/Sen2012.json", function(data) {
		var countyStyle = {
		"fill":0,
    	"color": "#ff6600",
    	"weight": 3,
    	"opacity": 0.65
	};
		StateSenateLayer = L.geoJson(data, {style:countyStyle});
  });
  $('#loading').hide();
	


});
