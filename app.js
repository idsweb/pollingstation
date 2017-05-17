require([
  "esri/Map",
  "esri/views/MapView",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/layers/GraphicsLayer",
  "esri/symbols/SimpleMarkerSymbol", 
  "esri/symbols/SimpleLineSymbol", 
  "esri/Color",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function(Map, MapView, QueryTask, Query, GraphicsLayer, SimpleMarkerSymbol, SimpleLineSymbol, Color, arrayUtils, dom, on){

  // URL to feature service containing points 
  var pstnUrl = "http://gis2.leeds.gov.uk/arcgis/rest/services/Public/Polling/FeatureServer/2"

  // Create graphics layer and symbol to use for displaying the results of query    
  var resultsLyr = new GraphicsLayer();

  // Point QueryTask to URL of feature service
  var pstnTask = new QueryTask({ url: pstnUrl });

  var params = new Query({
    returnGeometry: true,
    outFields: ["*"]
  });

  params.where = "POLL_ST_NO = 238"

    function getResults(response) {

    resultsLyr.removeAll();

    // Loop through each of the results 
    var pollingStResults = arrayUtils.map(response.features, function (feature) {



    feature.symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));
      
      // Try hard coding it as a test?
      feature.geometry.latitude = '53.8317174429';
      feature.geometry.longitude = '-1.61681594999';
      
      return feature;
    });

    resultsLyr.addMany(pollingStResults);

    // animate to the results after they are added to the map  
    view.goTo(pollingStResults);
  }

      function promiseRejected(err) {
      console.error("Promise rejected: ", err.message);
    }
      
  var map = new Map({
    basemap: "streets"
  });
  var view = new MapView({
    container: "viewDiv",  // Reference to the scene div created in step 5
    map: map,  // Reference to the map object created before the scene
    layers: [resultsLyr], // add graphics layer to the map
    zoom: 14,  // Sets the zoom level based on level of detail (LOD)
    center: [-1.6182250, 53.8254300]  // Sets the center point of view in lon/lat
  });

 function doQuery() {
    pstnTask.execute(params)
  .then(getResults)
  .otherwise(promiseRejected);

  console.log(view.layers[0].graphics.items)
 }

 // Call doQuery() each time the button is clicked    
      on(dom.byId("doBtn"), "click", doQuery);
});