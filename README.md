## Minnesota Legislative Coordinating Commission
### Legislative district mapping applciation

The **Who Represents Me?** application is a completely open-source full-stack, responsive (RWD) application, built with PostGIS, Leaflet, and a little TLC.

See it in the wild at ... 

### What's included?
- Code
- Data (GeoJSON)
  - MN Untied States Congressional Districts
  - MN House Districts
  - MN Senate Districts
  - MN Municipal Boundaries
  - MN Counties

The code relies on a connection to an instance of [PostGreSQL/PostGIS](http://www.postgresql.org/), a free and open-source spatial database. But for testing, connections can be made to the GeoJSON included in the data folder.

The GeoJSON in the data folder is used in the app to add overlay layers to the map, this saves time and allows the browser to cache the responses, thus increasing the load time speed significantly better than PostGIS queries.
