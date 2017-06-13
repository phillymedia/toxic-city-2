var smeltersData = require("./philadelphia-smelters.json");
var epa_philadelphiaData = require("./epa_philadelphia.json");
// require("./groupedlayercontrol");


var epaStyle = {
    radius: 4,
    color: "rgb(197, 209, 118)",
    fillOpacity: 1,
    opacity: 1,
    weight: 0
};

var sfStyle = {
    radius: 17,
    color: "#ff751a",
    fillOpacity: 0.7,
    opacity: 1,
    weight: 0
};


function smelterPopup(feature, layer) {
  layer.bindPopup("<div class='popup-headline'>"+feature.properties.SiteName+"</div><i>"+feature.properties.Address+"</i>");
}
function epaPopup(feature, layer) {
  if (feature.properties && feature.properties.SiteStatus) {
    layer.bindPopup("<div class='popup-headline'>"+feature.properties.Site+"</div><i>"+feature.properties.Address+"</i><div class='popup-text'><strong>Site Status:</strong><br>"+feature.properties.SiteStatus+"</div>");
    } else {
    layer.bindPopup("<div class='popup-headline'>"+feature.properties.Site+"</div><i>"+feature.properties.Address+"</i>");
    }
}



var epa_philadelphia = L.geoJson(epa_philadelphiaData, {
    onEachFeature: epaPopup,
    pointToLayer: function(feature, latlng) {
        if (feature.properties.NPL == "NPL") {
        return L.circleMarker(latlng, sfStyle);
      } else {
        return L.circleMarker(latlng, epaStyle);
      }
    }
});




// initialize the map
var basemapURL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '.png';


var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var mapSmelter = L.map('map-smelter', {
    center: [39.974259, -75.128513],
    zoom: 12,
    minZoom: 11
});

L.tileLayer(basemapURL, {
    attribution: '&copy; ' + mapLink + ' Contributors'
}).addTo(mapSmelter);





mapSmelter.scrollWheelZoom.disable();
mapSmelter.touchZoom.disable();



L.geoJSON(smeltersData, {
    onEachFeature: smelterPopup,
    pointToLayer: function(feature, latlng) {
        var industryIcon = L.divIcon({
            iconSize: new L.Point(26, 26),
            //iconAnchor:[50, 50],
            className: "industryIcon",
            html: '<div><i class="fa fa-industry" aria-hidden="true"></i></div>'
        });

        return L.marker(latlng, {
            icon: industryIcon
        });
    }
}).addTo(mapSmelter);










var toggle = true;


function togglePoints() {
    if (!toggle) {
        mapSmelter.removeLayer(epa_philadelphia);
    } else {
        mapSmelter.addLayer(epa_philadelphia);
    }
    toggle = !toggle;
}

$("#smelterbutton").click(function(){
  togglePoints();
});
