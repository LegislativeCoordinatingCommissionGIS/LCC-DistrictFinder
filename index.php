<!-- Remove the scripts from top2012.inc so that we have acces to them later -->
<!DOCTYPE html>
<html lang="en">
<head>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
	<!-- load the header -->
	<?
	    define('INCLUDEPATH',"views/");
	    include(INCLUDEPATH."top2012.inc");

	?>
	<script src="js/app.js"></script>
	<script src="js/helper.js"></script>
	<!-- Bring over the core js from top.inc -->
	<script type="text/javascript" src="http://www.gis.leg.mn/css/leg_core_20.js"></script>
	<script type="text/javascript"  src="http://www.gis.leg.mn/css/leg_mobile_20.js"></script>
	<script type="text/javascript" src="http://www.gis.leg.mn/css/js/hideshow2.js"></script>
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" />
	<link rel="stylesheet" href="css/plugins/css/font-awesome.min.css" />
	<link rel="stylesheet" href="css/app.css" />
	<script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>


<div class='leg_Col4of4-First'> <!-- Closes in footer - so leave this openended -->
	<h2 id='map_title'>Who Represents Me?</h2>
	<div id='map_reset'><a href='#'>Reset Map <i class="fa fa-refresh"></i></a></div>
    <a href="#"><div id="triangle-topright"><i class="fa fa-map fa-lg"></i></div></a>
    <div id="map_layers">
    	<div id="map_layers_content">
    		<div id="map_layers_toggle"> <a href="#" class="linkstyle">Hide Layers <i class="fa fa-map fa-sm"></i> <i class="fa fa-chevron-right fa-sm"></i></a></div>
    		<div id="map_layers_content_title">Layers</div>
    		<div id="map_layers_content_list">
    			<ul>
    				<li><input type="checkbox" name="mnhousegeom" value="Bike"> State House Boundaries <br></li>
    				<li><input type="checkbox" name="mnsenategeom" value="Bike"> State Senate Boundaries <br></li>
    				<li><input type="checkbox" name="ushousegeom" value="Bike"> Congressional Boundaries <br></li>
    			</ul>
    		</div>
    		<div id="map_layers_basemap_title">Basemap Layers</div>
    		<button id = "switchBasemap">Switch</button>
    	</div>
    </div>
	<div id="sidebar">
		<div id="officials">
			<ul >
				<div class='search'>
					<li >
						<div class='form-group'>
							<form action="javascript:submitQuery()">
				                <label for="geocode">Enter Address, City State, and Zipcode</label>
				                <input type="text" name="geocode"></input><button id="searchButton">Search</button>

				            </form>
				        </div>
			        </li>	
		        </div> 
		        <div class='mnhouse'>        	
			        <li >
			        	<img class='mnhouse_img'/ src='images/MNhouse53A.jpg' height='84px'>
			        	<ul class="membersublist">
			        		<li class='lcc_gis_member'>JoAnn Ward</li>
			        		<li class='lcc_gis_memberdistrict'>MN House - 53A</li>
			        	</ul>
			        </li>
			    </div>
			    <div class='mnsenate'>
			        <li >
			        	<img class='mnsenate_img' src='images/MNsenate53.jpg' height='84px'/>
			        	<ul class="membersublist">
			        		<li class='lcc_gis_member'>Susan Kent</li>
			        		<li class='lcc_gis_memberdistrict'>MN Senate - 53</li>
			        	</ul>
			        </li>
			    </div>
			    <div class='ushouse'>
			        <li >
			        	<img class='ushouse_img' src='images/UShouse4.jpg' height='84px'/>
			        	<ul class="membersublist">
			        		<li class='lcc_gis_member'>Betty McCollum</li>
			        		<li class='lcc_gis_memberdistrict'>U.S. House - 4</li>
			        	</ul>
			        </li>
			    </div>
			    <div class='ussenate1'>
			        <li >
			        	<img class='ussenate1_img' src='images/USsenate1.jpg' height='84px'/>
			        	<ul >
			        		<li class='lcc_gis_member'>Amy Klobuchar</li>
			        		<li class='lcc_gis_memberdistrict'>U.S. Senate</li>
			        	</ul>
			        </li>
			    </div>
			    <div class='ussenate2'>
			        <li >
			        	<img class='ussenate2_img' src='images/USsenate2.jpg' height='84px'/>
			        	<ul class="membersublist">
			        		<li class='lcc_gis_member'>Al Franken</li>
			        		<li class='lcc_gis_memberdistrict'>U.S. Senate</li>
			        	</ul>
			        </li>
			    </div>
		    </ul>
		</div>
	</div>

	<div id="map">
		
	</div>
	<div id='map_help'>
		<a href="#"><i class="fa fa-info-circle"></i> Help</a>
	</div>
	<div id='map_search_results_metadata'>
		Search Results for Latitude: 44.9374, Longitude: -92.9778
	</div>
	<div id='map_disclaimer'>
		<a href="#">Disclaimer <i class="fa fa-exclamation-triangle"></i> </a>
	</div>


<!-- End leg_PageContent from top.inc -->

<?
    include(INCLUDEPATH."footer2012.inc");
?>