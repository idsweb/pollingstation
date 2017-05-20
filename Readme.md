Arcgisonline find my polling station
====================================
These notes were made when prototyping an app to show someone's nearest polling station.

Map service urls
----------------
http://gis2.leeds.gov.uk/arcgis/rest/services/Public/Polling

This service has three feature layers:
1. Polling Combined showing houses and polling stations.
2. Polling Address shows just properties with matching entries.
3. Polling Station shows the polling stations http://gis2.leeds.gov.uk/arcgis/rest/services/Public/Polling/FeatureServer/2

Web set up
----------
The web site uses Node and Express to serve static HTML pages. To start the web server do
```javascript
npm install
npm start
```
The web server will listen on port 3000

AddFeatureLayer
---------------
http://localhost:3000/AddFeatureLayer_v32.html

This simple sample uses version 3.2 of the javascript api and adds a feature layer to a base map.
It shows a polling station as a point on a map.

http://localhost:3000/AddFeatureLayer_v42.html

This sample uses verion 4.2 of the api

QueryTask
---------
http://localhost:3000/AddressQuery_v42.html uses a Query to find a polling station with the id of 238.

http://gis2.leeds.gov.uk/arcgis/rest/services/Public/Polling/FeatureServer/2/query?where=POLL_ST_NO+%3D+%27238%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&f=html 

Query: POLL_ST_NO = '238'

However the geometry of the feature returned does not have lat/long. 

Its spatialreference object is below:
```javascript
spatialReference:Object
isGeographic:false
isWGS84:false
isWebMercator:false
isWrappable:false
latestVcsWkid:undefined
latestWkid:27700
```

An excert from https://gis.stackexchange.com/questions/122304/set-custom-spatial-reference-to-base-map-in-arcgis-javascript-api states:

The spatial reference for a map is defined either by the extent passed to the map constructor or by the first layer added to the map. Checkout the any projection sample to see how to specify different spatial references for a map.

If you're using the basemap or center and zoom options with the map constructor, the map's spatial reference will be web mercator.

This link may be useful https://osedok.wordpress.com/2012/01/17/conversion-of-british-national-grid-wkid27700-to-wgs84wkid4326-and-then-to-webmercator-wkid102100/

QueryFeatures
-------------
QueryFeatures uses the view.whenLayerView(featureLayer) function to zoom to the first feature returned when the layer is drawn. 
http://localhost:3000/QueryFeatures.html

As you can see if you set a breakpoint because the features are added to the basemap their geometry is WebMercator
```javascript
graphics[0].geometry.spatialReference.isWebMercator // returns true;
```
