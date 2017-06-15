var smeltersData = require("./philadelphia-smelters.json");
var newEpa = require("./new_epasites.geo.json")
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



var archiveStyle = {
    radius: 4,
    fillColor: "rgb(197, 209, 118)",
    fillOpacity: .8,
    opacity: 1,
    weight: 1,
    color:  "rgb(197, 209, 118)"

};

var activeStyle = {
    radius: 4,
    fillColor: "#ff751a",
    fillOpacity: .8,
    opacity: 1,
    weight: 1,
    color:  "#ff751a"
};


var epa_active = L.geoJson(newEpa, {
    filter: function(feature, layer) {
        if (feature.properties.active == "Y" || feature.properties.active !== "No")
        return feature.properties;
    },
    onEachFeature: epaPopup,
    pointToLayer: function(feature, latlng) {
        if (feature.properties.active == "Y" || feature.properties.active !== "No") {
        return L.circleMarker(latlng, activeStyle);
      } else {
        return L.circleMarker(latlng, archiveStyle);
      }
    }
})

var epa_archived = L.geoJson(newEpa, {
    filter: function(feature, layer) {
        if(feature.properties.active == "No" || feature.properties.active !== "Y")
        return feature.properties;
    },
    onEachFeature: epaPopup,
    pointToLayer: function(feature, latlng) {
        if(feature.properties.active == "No" || feature.properties.active !== "Y") {
        return L.circleMarker(latlng, archiveStyle);
      } else {
        return L.circleMarker(latlng, activeStyle);
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


function toggleEpaArchived() {
    if (!toggle1) {
        mapSmelter.removeLayer(epa_archived);
    } else {
        mapSmelter.addLayer(epa_archived);
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
            toggleActivePhila();
        }
        if(getId == "smelter-toggle-3") {
            toggleEpaArchived();

        }
    })

})
