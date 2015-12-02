## Minnesota Legislative Coordinating Commission
### Legislative district mapping applciation

The **Who Represents Me?** application is a completely open-source full-stack, responsive (RWD) application, built with PostGIS, Leaflet, and a little TLC.

See it in the wild at [http://gis.leg.mn](http://gis.leg.mn/OpenLayers/LCC-DistrictFinder/)

### What's included?
- Code
- Data (GeoJSON)
  - MN Untied States Congressional Districts
  - MN House Districts
  - MN Senate Districts
  - MN Municipal Boundaries
  - MN Counties
  - MN House, Senate, Congressional images

### What does it do?
- Fun geodev tools
  - Geocodes addresses (Google JavaScript API authentication token required)
  - Zooms to location on cellphones (application optimized using RWD)
- Creates [Leaflet labels](https://github.com/Ccantey/LCC-DistrictFinder/blob/master/js/app.js#L84-L91)! 
  - Not natively supported by leaflet
  - Places divIcon at [polygon centroid](https://github.com/Ccantey/LCC-DistrictFinder/blob/master/js/app.js#L169-L189), rather than .getBounds().getCenter() which is insuffient for irregular polys
- Basic UI/UX
  - Point and click on the map, or use the search bar to retrieve legislative data
  - Click on a legislative member to retrieve members district boundary or website
  - Add House/Senate overlay layers to geo-explore Minnesota's representative districts

The code relies on a connection to an instance of [PostGreSQL/PostGIS](http://www.postgresql.org/), a free and open-source spatial database. But for testing, connections can be made to the GeoJSON included in the data folder.

The GeoJSON in the data folder is used in the app to add overlay layers to the map, this saves time and allows the browser to cache the responses, thus increasing the load time speed significantly better than PostGIS queries.
