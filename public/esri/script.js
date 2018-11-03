
var map;
var navigation;
var dynamicLayer;
require([
  "esri/map",
  "esri/dijit/BasemapToggle",
  "esri/toolbars/draw", "dojo/parser", "dijit/registry",
  "dojo/dom", "dojo/on", "esri/graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/toolbars/edit",
  "esri/layers/FeatureLayer",
  "esri/config",
  "esri/tasks/query",
  "dojo/_base/event",
  "esri/dijit/editing/TemplatePicker",
  "esri/toolbars/navigation",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/dijit/Search",
  "esri/geometry/webMercatorUtils",
  "esri/Color",
  "esri/InfoTemplate",
  "esri/layers/ImageParameters",
  "esri/dijit/editing/TemplatePicker",
  "dojo/_base/array", "esri/dijit/Legend", "dojo/request",
  "dojo/domReady!"
], function (
  Map, BasemapToggle, Draw, parser, registry, dom, on, Graphic,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Edit,
  FeatureLayer, Config, Query, event, TemplatePicker, Navigation, ArcGISDynamicMapServiceLayer,
  Search, webMercatorUtils, Color, InfoTemplate, ImageParameters, TemplatePicker, arrayUtils, Legend, request
) {
    parser.parse();
    esriConfig.defaults.io.proxyUrl = "/proxy/";

    var customBaseMap = [
      {
        baseMapLayers: [
          {
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer"
          }
        ],
        thumbnailUrl: "https://www.example.com/images/thumbnail_2014-11-25_61051.png",
        title: "Delorme",
        id: 'delorme'
      },
      {
        baseMapLayers: [
          {
            url: "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer"
          }
        ],
        thumbnailUrl: "https://www.example.com/images/thumbnail_2014-11-25_61051.png",
        title: "street",
        id: 'street'
      }
    ];
    map = new Map("map", {
      basemap: "topo",
      center: [-82.44109, 35.6122],
      zoom: 4
    });

    map.on("load", createToolbar);

    let layers = [
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0",
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1",
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2"
    ]

    let layersLegnds = [
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/MapServer/0",
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/MapServer/1",
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/MapServer/2"
    ]



    let featureLayerArray = [];
    layers.forEach(url => {
      featureLayerArray.push(new FeatureLayer(url));
    });


    var enableSelection = false;


    function showCordinates(evt) {

      var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
      //display mouse coordinates
      dom.byId("coordinates").innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);

    }
    let visible = []
    let loadLegendaData;
    let loadLegendaDataOnce = true;

    async function loadLegends(index) {
      loadLegendaData = await request.get("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/MapServer/legend/?f=pjson", {
        f: "json", jsonp: "callback"
      })
      loadLegendaData = JSON.parse(loadLegendaData);
      let legendTxt = "";
      loadLegendaData.layers[index].legend.map(legends => {
        legendTxt += "<span><img src=data:image/png;base64," + legends.imageData + "> " + legends.label + "</span>";
      })
      return legendTxt
    }

    function resolveFunction(index) {
      return Promise.all([loadLegends(index)]).then(data => {
        return data[0];
      });
    }
    function buildLayerList(evt) {

      let items = dynamicLayer.layerInfos.map(async (layer, index) => {

        if (layer.defaultVisibility) {
          visible.push(layer.id)
        }

        return `<input id="${layer.id}" class="layerToggle" type="checkbox"+" ${(layer.defaultVisibility ? "checked=checked" : "")} > ${layer.name} <br /><div id="legendDiv">` + await loadLegends(index) + "</div>"


      });




      document.getElementById('layers').innerHTML = items;
      dynamicLayer.setVisibleLayers(visible);



      // console.log(items);
    }
    $('.layerToggle').on('click', () => {
      $(this).parent().find('input').map(element => {
        console.log(element)
      })
    })
    function createToolbar() {
      var imageParameters = new ImageParameters();
      imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.
      dynamicLayer = new ArcGISDynamicMapServiceLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/MapServer/", {

        "imageParameters": imageParameters
      });
      map.addLayer(dynamicLayer);

      dynamicLayer.on("load", buildLayerList);


      console.log(dynamicLayer.layers);





      map.on("mouse-move", showCordinates)
      var editToolbar = new Edit(map);
      navigation = new Navigation(map);
      var search = new Search({
        map: map
      }, "search");
      search.startup();
      toolbar = new Draw(map);
      toolbar.on("draw-end", addToMap)
      on(dom.byId("info"), "click", function (evt) {
        if (evt.target.id === "info") {
          return;
        }
        var tool = evt.target.id.toLowerCase();
        map.disableMapNavigation();
        toolbar.activate(tool);
      });
    }

    function addToMap(evt) {
      toolbar.deactivate();
      var symbol;
      let index;
      switch (evt.geometry.type) {
        case "point":
        case "multipoint":
          symbol = new SimpleMarkerSymbol();
          index = 0;

          break;
        case "polyline":
          symbol = new SimpleLineSymbol();
          index = 1;
          break;

        default:
          symbol = new SimpleFillSymbol();
          index = 2;

      }



      map.graphics.add(new Graphic(evt.geometry, symbol));
      let graphic = new Graphic(evt.geometry);
      graphic.attributes = { "symbolid": 1 };
      let featureLayer = new FeatureLayer(layers[index], {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ['*']
      });
      featureLayer.applyEdits([graphic], null, null, featuresuccess)
      function featuresuccess(data) {
        console.log(data)
      }

    }

    $(function () {
      $("#prev").click(function () {
        navigation.zoomToPrevExtent();

      });
      $("#next").click(function () {
        navigation.zoomToNextExtent();

      });
      $("#custom").click(function () {
        map.setBasemap(customBaseMap[0]);

      });
      $("#street").click(function () {
        map.setBasemap(customBaseMap[1]);

      });
    });

  });
