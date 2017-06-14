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

var epa_active = L.geoJson(epa_philadelphiaData, {
    filter: function(feature, layer) {
        if(feature.properties.NPL == "NPL")
        return feature.properties;
    },
    onEachFeature: epaPopup,
    pointToLayer: function(feature, latlng) {
        if (feature.properties.NPL == "NPL") {
        return L.circleMarker(latlng, sfStyle);
      } else {
        return L.circleMarker(latlng, epaStyle);
      }
    }
})

var epa_philadelphia = L.geoJson(epa_philadelphiaData, {
    filter: function(feature, layer) {
        if(feature.properties.NPL !== "NPL")
        return feature.properties;
    },
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



var smelstersdatajson = L.geoJSON(smeltersData, {
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









var toggle = false;
var toggle1 = true;
var toggle2 = true;

function toggleSmelters() {
    if (!toggle) {
        mapSmelter.removeLayer(smelstersdatajson);
    } else {
        mapSmelter.addLayer(smelstersdatajson);
    }
    toggle = !toggle;
}


function toggleEpaPhila() {
    if (!toggle1) {
        mapSmelter.removeLayer(epa_philadelphia);
    } else {
        mapSmelter.addLayer(epa_philadelphia);
    }
    toggle1 = !toggle1;
}
function toggleActivePhila() {
    if (!toggle2) {
        mapSmelter.removeLayer(epa_active);
    } else {
        mapSmelter.addLayer(epa_active);
    }
    toggle2 = !toggle2;
}

// $("#smelterbutton").click(function(){
//   togglePoints();
// });

$("#smelter-map-legend .button-row").each(function() {
    $(this).on("click", function() {
        $(this).toggleClass("button-selected");

        var getId = $(this).attr("id");
        if(getId == "smelter-toggle-1") {
            toggleSmelters();
        }
        if(getId == "smelter-toggle-2") {
            toggleEpaPhila();
        }
        if(getId == "smelter-toggle-3") {
            toggleActivePhila();
        }
    })

})
