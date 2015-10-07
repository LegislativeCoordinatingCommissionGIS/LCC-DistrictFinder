var map,
	fields = ["district", "name"], 
	autocomplete = [];

var tileLayer1,tileLayer2;

//kickoff
$( document ).ready(initialize);

function initialize(){
	$("#map").height('542px');
	$("#map").width('70%')

	map = L.map("map", {
		center: L.latLng(46.1706, -93.6678),
		zoom: 6
	});


    
	tileLayer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
					maxZoom: 18,
					minZoom: 6,
					attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
						'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
						'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.streets'
					}).addTo(map);
	tileLayer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
					maxZoom: 18,
					minZoom: 6,
					attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
						'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
						'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.streets-satellite'
					})
	// tileLayer2 = L.esri.tiledMapLayer({
	// 	            url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer', 
	// 				maxZoom: 18,
	// 				minZoom: 6,
	// 				attribution: 'Imagery &copy; <a href="http://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri</a>, ' +
	// 				       'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>'
	// 				})

	toggleLayers($('#satellitonoffswitch'),tileLayer1,tileLayer2);
    
	//next: add features to map
	//getGeoData();
};

function toggleLayers(el, layer1, layer2){
	if (el.is(':checked')){
		map.removeLayer(layer2);
		map.addLayer(layer1);
	} else {
		map.removeLayer(layer1);
		map.addLayer(layer2);
	}
}

//perhaps use this to get initial layers
function getGeoData(){
	// $.ajax("php/getBaseData.php", {
	// 	data: {
	// 		table: "hse2012",
	// 		fields: "fields"
	// 	},
	// 	success: function(data){
	// 		mapData(data);
	// 	}
	// })
};

function mapData(data){	
	//console.log(data);
	//remove existing map layers
	map.eachLayer(function(layer){
		//Remove old layer
		// console.log(layer);
		if (typeof layer._url === "undefined" ){
			map.removeLayer(layer);
		}
	});
   
	//create geojson container object
	var geojson = {
		"type": "FeatureCollection",
		"features": []
	};

	//split data into features
	var dataArray = data.split(", ;");
	
	dataArray.pop();
    
    
	
	//build geojson features
	dataArray.forEach(function(d){
		d = d.split(", "); //split the data up into individual attribute values and the geometry
        
		//feature object container
		var feature = {
			"type": "Feature",
			"properties": {}, //properties object container
			"geometry": JSON.parse(d[fields.length]) //parse geometry
		};

		for (var i=0; i<fields.length; i++){
			feature.properties[fields[i]] = d[i];
		};

		//add feature names to autocomplete list
		// if ($.inArray(feature.properties.featname, autocomplete) == -1){
		// 	autocomplete.push(feature.properties.featname);
		// };

		geojson.features.push(feature);

	});
	addMemberData(geojson);
    // console.log(geojson);
    
    //activate autocomplete on featname input
    // $("input[name=featname]").autocomplete({
    //     source: autocomplete
    // });
var myStyle = {
    "color": "#231f20",
    "weight": 2,
    "opacity": 0.65
};

	var mapDataLayer = L.geoJson(geojson, {
		style:myStyle,
		onEachFeature: function (feature, layer) {
			var html = "";
			for (prop in feature.properties){
				html += prop+": "+feature.properties[prop]+"<br>";
			};
	        layer.bindPopup(html);
	    }
	});
	mapDataLayer.addTo(map);
    
	//zoom to bounds
	// console.log(mapDataLayer.getBounds().getCenter())
	//USE THIS FOR SEARCH
	//map.fitBounds(mapDataLayer.getBounds());
	//addMarker();
	//map.setView(L.latLng(mapDataLayer.getBounds().getCenter())).setZoom(10);

};

function submitQuery(){
	//get the form data
	var formdata = $("#mainsearchform").serializeArray();
    // console.log(formdata);
	//add to data request object
	var data = {
		table: "hse2012",
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

function identifyDistrict(d){
	// console.log(d.latlng);
    

	var data = {
		table: "hse2012",
		fields: fields,
		//geom: d.latlng,
		lat: d.latlng.lat,
		lng: d.latlng.lng
	};

	//console.log(data);

	$.ajax("php/getPointData.php", {
		 data: data,
		success: function(result){
			
			mapData(result);

		}, 
		error: function(){
			console.log('error');
		}
	});
}
function addMemberData(memberData){
	console.log(memberData.features[0].properties.district);
	// memberData.features[0] = MN House
	// memberData.features[1] = MN Senate
	// memberData.features[2] = US House

	//also show hyperlinks here
    $('.memberLink').show();
    
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
	var newMarker = new L.marker(e.latlng).addTo(map);
}

