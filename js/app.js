var map, geojson, mapDistrictsLayer,
	fields = ["district", "name"], switchMap ={},
	autocomplete = [];

//map Layers
var pushPinMarker, vectorBasemap,streetsBasemap, MinnesotaBoundaryLayer;
//map overlay layers... called like overlayLayers.CongressionalBoundaryLayer
var overlayLayers ={};

var geocoder = null;

//Set initial basemap with initialize() - called in helper.js
function initialize(){
	$("#map").height('542px');
	// $("#map").width('100%')

	map = L.map("map", {
		center: L.latLng(46.1706, -93.6678),
		zoom: 6
	});
    geocoder = new google.maps.Geocoder;

// Try HTML5 geolocation.
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var pos = {
  //       latlng: {lat:position.coords.latitude,lng:position.coords.longitude},
  //       lat:position.coords.latitude,
  //       lng:position.coords.longitude
  //     };

  //     //infoWindow.setPosition(pos);
  //     //infoWindow.setContent('Location found.');
  //     //addMarker(pos);
	 //  //identifyDistrict(pos);
	 //  map.setView(L.latLng(pos.lat, pos.lng),13);

  //   }, function() {
  //     handleLocationError(true, infoWindow, map.getCenter());
  //   });
  // } else {
  //   // Browser doesn't support Geolocation
  //   handleLocationError(false, infoWindow, map.getCenter());
  // }


	vectorBasemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
					maxZoom: 18,
					minZoom: 6,
					attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
						'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
						'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.streets'
					}).addTo(map);
	streetsBasemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
					maxZoom: 18,
					minZoom: 6,
					attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
						'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
						'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.streets-satellite'
					})

	toggleBaseLayers($('#satellitonoffswitch'),vectorBasemap,streetsBasemap);

};


// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//                         'Error: The Geolocation service failed.' :
//                         'Error: Your browser doesn\'t support geolocation.');
// }

//toggle basemap layers
function toggleBaseLayers(el, layer1, layer2){
	//console.log(el, 'has been toggled');
	if (el.is(':checked')){
		map.removeLayer(layer2);
		map.addLayer(layer1);
	} else {
		map.removeLayer(layer1);
		map.addLayer(layer2);
	}
}

function getOverlayLayers(el, switchId){
    $('#loading').show();
	//getCityLayersGeoJson();
    switchMap = {"countyonoffswitch": "CountyBoundaryLayer", "cityonoffswitch":"CityBoundaryLayer", "cononoffswitch":"CongressionalLayer", "ssonoffswitch":"StateSenateLayer", "shonoffswitch":"StateHouseLayer"}
    // console.log(typeof switchMap[switchId]);
	var dataMap = {"shonoffswitch": "HSE2012" , "ssonoffswitch": "Sen2012", "cononoffswitch":"Cong2012", "cityonoffswitch": "MCD2010", "countyonoffswitch":"County2010", MinnesotaBoundaryLayer:"Minnesota2015"};
    
    if(el.is(':checked')){
    	map.removeLayer(overlayLayers[switchMap[switchId]]);

		$('#loading').hide();
    } else {
    	if(typeof overlayLayers[switchMap[switchId]] === 'undefined'){
			$.getJSON("./data/"+dataMap[switchId]+".json", function(data) {
				overlayLayers[switchMap[switchId]] = L.geoJson(data, {style:layerStyle(switchId)});						 
			}).done(function(){
				//console.log(switchMap[switchId]);
				overlayLayers[switchMap[switchId]].addTo(map);
				$('#loading').hide();
			});
		} else {
			console.log('here');
			overlayLayers[switchMap[switchId]].addTo(map);
			$('#loading').hide();
		}
    }
}

function layerStyle(switchId){
	var countyStyle = {
		"fill":0,
	     	"color": "#231f20",
	     	"weight": 4,
	     	"opacity": 0.65
	};

	var HSEStyle = {
		"fill":0,
	     	"color": "#ff6600",
	     	"dashArray":"7,7",
	     	"weight": 2,
	     	"opacity": 0.65
	};

	var congressStyle = {
		"fill":0,
	     	"color": "#ff3399",
	     	"weight": 2,
	     	"opacity": 0.65
	};

	var senStyle = {
		"fill":0,
	     	"color": "#ff6600",
	     	"weight": 3,
	     	"opacity": 0.65
	};

	var cityStyle = {
		"fill":0,
		"color": "#231f20",
		"weight": 1,
		"pacity": 0.65
	};	

	var styleMap = {"countyonoffswitch": countyStyle, "cityonoffswitch":cityStyle, "cononoffswitch":congressStyle, "ssonoffswitch":senStyle, "shonoffswitch":HSEStyle}

	return styleMap[switchId];

}

function geoCodeAddress(geocoder, resultsMap) {

  var address = document.getElementById('geocodeAddress').value;
  $("#loading").show();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var precision = results[0].geometry.location_type;
      var components = results[0].address_components;

      var pos = {
        latlng: {lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()},
        lat:results[0].geometry.location.lat(),
        lng:results[0].geometry.location.lng()
      };
      // console.log(pos.lat);
      // console.log(pos.lng);
      map.setView(L.latLng(pos.lat,pos.lng),16);
      addMarker(pos);
      identifyDistrict(pos);
      geocodeFeedback(precision, components);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function geocodeFeedback(precision, components){
	console.log(precision, 'location, center of ', components[0].types[0]);
	var message = "";
	var componentMap = {"street_number": "street", "postal_code": "zip code", "administrative_area_level_1": "state", "locality": "city", "administrative_area_level_2": "county", "route": "route", "intersection": "intersection", "political": "political division", "country": "country","administrative_area_level_3": "minor civil division", "administrative_area_level_4": 'minor civil division', "administrative_area_level_5": "minor civil division", "colloquial_area": "country", "neighborhood": "neighborhood", "premise": "building", "subpremise": "building", "natural_feature": "natural feature", "airport": "airport", "park": "park", "point_of_interest": "point of interest"};

	if (precision == "ROOFTOP"){
		message = "Address match!";
		$('#geocodeFeedback').html(message).css('color', 'green');
		$('#geocodeFeedback').show();
	} else {
		message = "Approximate location! Center of " + componentMap[components[0].types[0]];
		$('#geocodeFeedback').html(message).css('color', 'red');
		$('#geocodeFeedback').show();
	}
	
}
//submit search text box - removed button for formatting space
function keypressInBox(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode                        
        e.preventDefault();
        geoCodeAddress(geocoder, map);
        //$("yourFormId").submit();
    }
};

//I will use this for search as well.. the geocoder should return lat long, just pass it through and add marker
function identifyDistrict(d){
	// console.log(d.latlng);    

	var data = {
		lat: d.latlng.lat,
		lng: d.latlng.lng
	};
    $("#loading").show();
	$.ajax("php/getPointData.php", {
		 data: data,
		success: function(result){			
			addMemberData(result);
		}, 
		error: function(){
			console.log('error');
		}
	});
}

//sidebar list data
function addMemberData(memberData){
	// memberData.features[0] = MN House
	// memberData.features[1] = MN Senate
	// memberData.features[2] = US House
	if (typeof memberData.features[0] !== "undefined"){
	    $('#mask').hide();
	    geojson = memberData;
		//also show hyperlinks here
	    $('.memberLink').show();
	    
	    //add memberdata from map selection to member list
	    $('#housephoto').attr('src', 'images/House/tn_'+memberData.features[0].properties.district+'.jpg');
		$('#housemember').html(memberData.features[0].properties.name + '<span class="party"> ('+memberData.features[0].properties.party+')</span>').delay("slow").fadeIn();
		$('#housedistrict').html('MN House - ' + memberData.features[0].properties.district).delay("slow").fadeIn();
		
		$('#senatephoto').attr('src', 'images/Senate/'+memberData.features[1].properties.district+'.jpg');
		$('#senatemember').html(memberData.features[1].properties.name + '<span class="party">  ('+memberData.features[1].properties.party+')</span>');
		$('#senatedistrict').html('MN Senate - ' + memberData.features[1].properties.district);
		
		$('#ushousephoto').attr('src', 'images/USHouse/US'+memberData.features[2].properties.district+'.jpg');
		$('#ushousemember').html(memberData.features[2].properties.name + ' <span class="party"> ('+memberData.features[2].properties.party+')</span>');
		$('#ushousedistrict').html('U.S. House - ' + memberData.features[2].properties.district);
		
		$('#ussenatephoto').attr('src', 'images/USSenate/USsenate1.jpg');
		$('#ussenatemember').html('Amy Klobuchar <span class="party"> (DFL)</span>');
		$('#ussenatedistrict').html('U.S. Senate' );
		
		$('#ussenatephoto2').attr('src', 'images/USSenate/USsenate2.jpg');
		$('#ussenatemember2').html('Al Franken <span class="party"> (DFL)</span>');
		$('#ussenatedistrict2').html('U.S. Senate');
		$("#loading").hide();
	} else { 
		$('#mask').show();
		$('#loading').hide();
	}
	
}

function addMarker(e){
	//remove sidebar formatting
	$( ".mnhouse, .mnsenate, .ushouse, .ussenate1, .ussenate2" ).removeClass('active');
	$('.memberLink').hide();
	$('#housemember, #senatemember, #ushousemember, #ussenatemember, #ussenatemember2').html('');
    $('#housedistrict, #senatedistrict, #ushousedistrict, #ussenatedistrict, #ussenatedistrict2').html('');
    $('#housephoto, #senatephoto, #ushousephoto, #ussenatephoto, #ussenatephoto2').removeAttr('src');

    //remove old pushpin and previous selected district layers 
	if (typeof pushPinMarker !== "undefined" ){ 
		map.removeLayer(pushPinMarker);			
	}
	if (typeof mapDistrictsLayer !== "undefined" ){ 
		map.removeLayer(mapDistrictsLayer);			
	}

	//add marker
	pushPinMarker = new L.marker(e.latlng).addTo(map);
}

//Show the district on the map
function showDistrict(div){
	slideSidebar();
	//$('#toggleSidebar').show();
	//div is the class name of the active member
	divmap = {"mnhouse active":0, "mnsenate active":1, "ushouse active":2};

	//remove preveious district layers.
	if (typeof mapDistrictsLayer !== "undefined" ){ 
		map.removeLayer(mapDistrictsLayer);			
	}
    
    //polygon overlay styling
	var myStyle = {
    	"color": "#231f20",
    	"weight": 2,
    	"opacity": 0.65
	};
    //console.log(geojson.features[divmap[div]]);
    mapDistrictsLayer = L.geoJson(geojson.features[divmap[div]], {
		style:myStyle,
		onEachFeature: function (feature, layer) {
			var html = "";
			for (prop in feature.properties){
				html += prop+": "+feature.properties[prop]+"<br>";
			};
	        layer.bindPopup(html);
	    }
	}).addTo(map);
	//zoom to selection
	map.fitBounds(mapDistrictsLayer.getBounds())
}

function showSenateDistrict(div){
    slideSidebar();
    //$('#toggleSidebar').show();
	//remove preveious district layers.
	if (typeof mapDistrictsLayer !== "undefined" ){ 
		map.removeLayer(mapDistrictsLayer);			
	}
    
    mapDistrictsLayer = MinnesotaBoundaryLayer.addTo(map);
	map.fitBounds(mapDistrictsLayer.getBounds())
}

function slideSidebar(){
	if ($('#sidebar').hasClass('animate')){
			$('#sidebar').removeClass('animate');
			$('#sidebar').animate({ 'left': '-100%' }, 500, 'easeOutQuad');
		} else {
			$('#sidebar').addClass('animate');
			$('#sidebar').animate({ 'left': '0px' }, 500, 'easeInQuad');
		}
}

