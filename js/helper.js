$( document ).ready(function() {
	//kickoff map logic
    initialize();

    //map navigation
    map.on('click', function(e){
    	addMarker(e);
        $('#housephoto, #senatephoto, #ushousephoto, #ussenatephoto, #ussenatephoto2').attr('src',"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=").attr('width',0).attr('height',0);;
		identifyDistrict(e);
		$('#geocodeFeedback').hide();
		$("#geocodeAddress").val('');
		slideSidebar();

	});
	// map.on('layeradd', function(){
	// 	scale = map.getZoom()
	// 	if (scale < 7){
	// 		$('.leaflet-marker-icon.StateHouseLayer, .leaflet-marker-icon.StateSenateLayer, .leaflet-marker-icon.CountyBoundaryLayer').hide();
	// 	}
	// 	console.log(map.getZoom())
	// })
	// map.on('zoomend', function(){
	// 	scale = map.getZoom()
	// 	if (scale == 6){
	// 		$('.leaflet-marker-icon.StateHouseLayer, .leaflet-marker-icon.StateSenateLayer, .leaflet-marker-icon.CountyBoundaryLayer').hide();

	// 	} else{
	// 		$('.leaflet-marker-icon.StateHouseLayer, .leaflet-marker-icon.StateSenateLayer, .leaflet-marker-icon.CountyBoundaryLayer').show();

	// 	}
	// })
 	// var currentScale =map.getZoom();
  //   if(currentScale > 2300){
  //       $("#DimLabels").prop('indeterminate', true).change();
  //       $("#DimLabels").prop('disabled', true).change();
  //       $("#DimLabels").parent().css("color", "#777");
  //   }else{
  //       $("#DimLabels").prop('indeterminate', false).change();
  //       $("#DimLabels").prop('disabled', false).change();
  //       $("#DimLabels").parent().css("color", "#FFF");
  //   }
  //   if(currentScale > 4800){
  //       $("#AddLabels,#PidLabels").prop('indeterminate', true).change();
  //       $("#AddLabels,#PidLabels").prop('disabled', true).change();
  //       $("#AddLabels,#PidLabels").parent().css("color", "#777");
  //   }else{
  //       $("#AddLabels,#PidLabels").prop('indeterminate', false).change();
  //       $("#AddLabels,#PidLabels").prop('disabled', false).change();
  //       $("#AddLabels,#PidLabels").parent().css("color", "#FFF");
  //   }
  //   if (currentScale > 9600){
  //       $("#Contours, #Adraw").prop('indeterminate', true).change();
  //       $("#Contours, #Adraw").prop('disabled', true).change();
  //       $("#Contours, #Adraw").parent().css("color", "#777")    
  //   }else{
  //       $("#Contours, #Adraw").prop('indeterminate', false).change();
  //       $("#Contours, #Adraw").prop('disabled', false).change();
  //       $("#Contours, #Adraw").parent().css("color", "#FFF")        
  //   }           

    // on small screens
	$('#toggleSidebar').click(function(e){
		e.preventDefault();
		slideSidebar();
	});
    
    // on small screens
	$('#pull-out').click(function(e){
		slideSidebar();
	});

	// on small screens
	$('#pull-in').click(function(e){
		slideSidebar();
	});

    // on small screens allow geolocation
    $('#gpsButton').click(function(e){
    	e.preventDefault();
    	zoomToGPSLocation();
    });

    // enter key event
    $("#geocodeAddress").bind("keypress", {}, keypressInBox);
    
    // both key and enter fire geoCodeAddress
    $('#searchButton').click(function(e){
    	e.preventDefault();
    	geoCodeAddress(geocoder, map);
    })
	
	// hide links - format is off until results come back
    $('.memberLink').hide();

	// Members UI click turn red with 'active' class
	$( ".mnhouse, .mnsenate, .ushouse" ).click(function() {
	  $(this).addClass('active').siblings().removeClass('active');
	  showDistrict($(this).attr('class'));
	});

	//get static minnesota geojson (faster than php)
	$( ".ussenate1, .ussenate2" ).click(function() {
	 	 $(this).addClass('active').siblings().removeClass('active');
	  	//console.log($(this).attr('class'));
	  	//getCongLayersGeoJson();
	  	if(typeof MinnesotaBoundaryLayer === 'undefined'){
			$.getJSON("./data/Minnesota2015.json", function(data) {
				var myStyle = {
    				"color": "#231f20",
    				"weight": 2,
    				"opacity": 0.65
				};
				MinnesotaBoundaryLayer = L.geoJson(data, {style:myStyle});
  			}).done(function(){
  				showSenateDistrict();
  			});
  		} else {
  			showSenateDistrict();
  		}	  	

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

		if (map.hasLayer(vectorBasemap)){
			map.removeLayer(vectorBasemap);
			map.addLayer(streetsBasemap);
		} else {
			map.removeLayer(streetsBasemap);
			map.addLayer(vectorBasemap);
		}
	});

    //fetch overlay layers
	$('#countyonoffswitch, #cononoffswitch, #ssonoffswitch, #shonoffswitch, #cityonoffswitch').click(function(){
		//console.log(typeof($(this).attr('id')));
        getOverlayLayers($(this), $(this).attr('id'));
	});

	//map reset
	$('#map_reset').click(function(){
		map.setView(L.latLng(46.1706, -93.6678),6);
		$('#mask').show();
		$('#geocodeFeedback').hide();
		$("#geocodeAddress").val('');
		$( ".mnhouse, .mnsenate, .ushouse, .ussenate1, .ussenate2" ).removeClass('active');
		$('.memberLink').hide();
		$('#housemember, #senatemember, #ushousemember, #ussenatemember, #ussenatemember2').html('');
		$('#housedistrict, #senatedistrict, #ushousedistrict, #ussenatedistrict, #ussenatedistrict2').html('');
		        $('#housephoto, #senatephoto, #ushousephoto, #ussenatephoto, #ussenatephoto2').attr('src',"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=").attr('width',0).attr('height',0);;


		//Toggle basemap when you reset -- LATER SET ALL CHECKBOXES THIS WAY!!!
		//verbose, should do this cleaner
		if($('#satellitonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			toggleBaseLayers($('#satellitonoffswitch'),streetsBasemap,vectorBasemap);
			$('#satellitonoffswitch').prop('checked', true);
		}
		// reset additional layers too
		if($('#countyonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			$('#countyonoffswitch').prop('checked', true);
		}
		if($('#cityonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			$('#cityonoffswitch').prop('checked', true);
		}
		if($('#cononoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			$('#cononoffswitch').prop('checked', true);
		}
		if($('#ssonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			$('#ssonoffswitch').prop('checked', true);
		}
		if($('#shonoffswitch').is(':checked')){
				//:checked = true -> leave it ... when I copied the switches I had initial states backwards
		} else {
			//:checked = false -> toggle map
			$('#shonoffswitch').prop('checked', true);
		}
		//Remove all layers except the basemap -- down here because its an asychronous thead apparently
		map.eachLayer(function(layer){
			//Remove map layers except mapbox
			if (typeof layer._url === "undefined" || typeof layer.defaultWmsParams !== "undefined"){
				map.removeLayer(layer);				
			};	
		});	   
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
    	$('.fa-map').css('color', '#8d8d8d'); 
    }).on('mouseleave', function(){
    	$('.fa-map').css('color', '#e6e6e6');
    });    

	$('#loading').hide();

	console.log("Welcome to the 'Who Represents Me?' legislative district finder application, developed by the MN State Legislative Coordinating Commission. The application's responsive web design(RWD), open-source code can be found at 'https://github.com/Ccantey/LCC-DistrictFinder'.")

});//end ready()

