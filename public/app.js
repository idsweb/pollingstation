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
], function (Map, MapView, QueryTask, Query, GraphicsLayer, SimpleMarkerSymbol, SimpleLineSymbol, Color, arrayUtils, dom, on) {

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

    function doQuery() {
        pstnTask.execute(params)
            .then(getResults)
            .otherwise(promiseRejected);

        console.log("Graphics" + view.graphics.length)
    }

    function getResults(response) {

        //resultsLyr.removeAll();

        // Loop through each of the results 
        var pollingStResults = arrayUtils.map(response.features, function (feature) {

            feature.symbol = new SimpleMarkerSymbol({
                color: [226, 119, 40],
                outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 20}
            });

            return feature;
        });


        resultsLyr.addMany(pollingStResults);

        console.log("graphics" + view.layers[0].graphics.length)

        // print the number of results returned to the user
        dom.byId("printResults").innerHTML = pollingStResults.length + " results found!";
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

    // Call doQuery() each time the button is clicked    
    on(dom.byId("doBtn"), "click", doQuery);
});