var map, geojson, mapDistrictsLayer,
	fields = ["district", "name"], 
	autocomplete = [];

//map Layers
var pushPinMarker, vectorBasemap,streetsBasemap, StateHouseLayer, StateSenateLayer, CongressionalLayer, CityBoundaryLayer, CountyBoundaryLayer;

//Set initial basemap with initialize() - called in helper.js
function initialize(){
	$("#map").height('542px');
	$("#map").width('70%')

	map = L.map("map", {
		center: L.latLng(46.1706, -93.6678),
		zoom: 6
	});


    
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

	toggleLayers($('#satellitonoffswitch'),vectorBasemap,streetsBasemap);
    
	//next: add features to map

};

//toggle basemap layers
function toggleLayers(el, layer1, layer2){
	console.log(el, 'has been toggled');
	if (el.is(':checked')){
		map.removeLayer(layer2);
		map.addLayer(layer1);
	} else {
		map.removeLayer(layer1);
		map.addLayer(layer2);
	}
}

function toggleOverlayLayers(el, switchId){
	console.log(switchId, 'has been toggled');
	//layerIdMap = {'countyonoffswitch':CountyLayer,'cityonoffswitch': CityLayer,'cononoffswitch': CongressionalLayer, 'ssonoffswitch': StateSenateLayer,'shonoffswitch': StateHouseLayer };
	// reset additional layers too
	var switchMap = {"countyonoffswitch": CountyBoundaryLayer, "cityonoffswitch":CityBoundaryLayer, "cononoffswitch":CongressionalLayer, "ssonoffswitch":StateSenateLayer, "shonoffswitch":StateHouseLayer}
	console.log(switchMap[switchId]);

	if(el.is(':checked')){
			//:checked = true -> leave it ... when I copied the switches I had initial states backwards
			//Turn ON this layer
			map.removeLayer(switchMap[switchId]);
			console.log(el, "is Checked");
		} else {
			//:checked = false -> toggle map
			//Turn OFF this layer
			switchMap[switchId].addTo(map);
			
			console.log(el, "is NOT Checked");
			//toggleLayers($('#satellitonoffswitch'),streetsBasemap,vectorBasemap);
			//$('#satellitonoffswitch').prop('checked', true);
		}
}


function submitQuery(){
	//get the form data
	var formdata = $("#mainsearchform").serializeArray();
    // console.log(formdata);
	//add to data request object
	var data = {
		table: "hse2012_1",
		fields: fields
	};
	formdata.forEach(function(dataobj){
		data[dataobj.name] = dataobj.value;
	});
    // console.log(formdata);
	//call the php script
	$.ajax("php/getSearchData.php", {
		data: data,
		success: function(result){
			mapData(result);
		}
	})
};

//I will use this for search as well.. the geocoder should return lat long, just pass it through and add marker
function identifyDistrict(d){
	// console.log(d.latlng);    

	var data = {
		// table: "hse2012_1",
		// fields: fields,
		//geom: d.latlng,
		lat: d.latlng.lat,
		lng: d.latlng.lng
	};

	//console.log(data);

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
	//console.log(memberData);
	// memberData.features[0] = MN House
	// memberData.features[1] = MN Senate
	// memberData.features[2] = US House
    geojson = memberData;
	//also show hyperlinks here
    $('.memberLink').show();
    
    //add memberdata from map selection to member list
	$('#housemember').html(memberData.features[0].properties.name);
	$('#housedistrict').html('MN House - ' + memberData.features[0].properties.district);
	$('#housephoto').attr('src', 'images/House/tn_'+memberData.features[0].properties.district+'.jpg')

	$('#senatemember').html(memberData.features[1].properties.name);
	$('#senatedistrict').html('MN Senate - ' + memberData.features[1].properties.district);
	$('#senatephoto').attr('src', 'images/Senate/'+memberData.features[1].properties.district+'.jpg')

	$('#ushousemember').html(memberData.features[2].properties.name);
	$('#ushousedistrict').html('U.S. House - ' + memberData.features[2].properties.district);
	$('#ushousephoto').attr('src', 'images/USHouse/US'+memberData.features[2].properties.district+'.jpg')

	$('#ussenatemember').html('Amy Klobuchar');
	$('#ussenatedistrict').html('U.S. Senate' );
	$('#ussenatephoto').attr('src', 'images/USSenate/USsenate1.jpg')

	$('#ussenatemember2').html('Al Franken');
	$('#ussenatedistrict2').html('U.S. Senate');
	$('#ussenatephoto2').attr('src', 'images/USSenate/USsenate2.jpg')
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
	//div is the class name of the active member
	divmap = {"mnhouse active":0, "mnsenate active":1, "ushouse active":2, "ussenate1 active":3 , "ussenate2 active":3};
    console.log(divmap[div]);

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
    console.log(geojson.features[divmap[div]]);
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

