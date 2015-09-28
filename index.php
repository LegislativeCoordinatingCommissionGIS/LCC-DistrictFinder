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
	<!-- Bring over teh core js from top.inc -->
	<script type="text/javascript" src="http://www.gis.leg.mn/css/leg_core_20.js"></script>
	<script type="text/javascript"  src="http://www.gis.leg.mn/css/leg_mobile_20.js"></script>
	<script type="text/javascript" src="http://www.gis.leg.mn/css/js/hideshow2.js"></script>
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" />
	<link rel="stylesheet" href="css/app.css" />
	<script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>


<div class='leg_Col4of4-First'> <!-- Closes in footer - so leave this openended -->
	<h2>Who Represents Me</h2>
	<div id="sidebar">
		<ul id="officials">
			<li class='search'>
				<form action="javascript:submitQuery()">
	                <label for="geocode">Enter Address, City State, and Zipcode</label>
	                <input type="text" name="geocode"></input><button id="searchButton">Search</button>

	            </form>
	        </li>	        	
	        <li class='mnhouse'>
	        	<img class='mnhouse_img'/ src='images/MNhouse53A.jpg' height='84px'>
	        	<ul class="membersublist">
	        		<li class='lcc_gis_member'>JoAnn Ward</li>
	        		<li class='lcc_gis_memberdistrict'>MN House - 53A</li>
	        	</ul>
	        </li>
	        <li class='mnsenate'>
	        	<img class='mnsenate_img' src='images/MNsenate53.jpg' height='84px'/>
	        	<ul class="membersublist">
	        		<li class='lcc_gis_member'>Susan Kent</li>
	        		<li class='lcc_gis_memberdistrict'>MN Senate - 53</li>
	        	</ul>
	        </li>
	        <li class='ushouse'>
	        	<img class='ushouse_img' src='images/UShouse4.jpg' height='84px'/>
	        	<ul class="membersublist">
	        		<li class='lcc_gis_member'>Betty McCollum</li>
	        		<li class='lcc_gis_memberdistrict'>U.S. House - 4</li>
	        	</ul>
	        </li>
	        <li class='ussenate1'>
	        	<img class='ussenate1_img' src='images/USsenate1.jpg' height='84px'/>
	        	<ul class="membersublist">
	        		<li class='lcc_gis_member'>Amy Klobuchar</li>
	        		<li class='lcc_gis_memberdistrict'>U.S. Senate</li>
	        	</ul>
	        </li>
	        <li class='ussenate2'>
	        	<img class='ussenate2_img' src='images/USsenate2.jpg' height='84px'/>
	        	<ul class="membersublist">
	        		<li class='lcc_gis_member'>Al Franken</li>
	        		<li class='lcc_gis_memberdistrict'>U.S. Senate</li>
	        	</ul>
	        </li>
	    </ul>
	</div>
	<div id="map"></div>
<!-- End leg_PageContent from top.inc -->

<?
    include(INCLUDEPATH."footer2012.inc");
?>