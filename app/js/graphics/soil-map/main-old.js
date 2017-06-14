var soil_scrubbedData = require("./soil_scrubbed.json");
var smelters_localData = require("./smelters_local.json");


// initialize the map
var base = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors'
})

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    bounds = new L.LatLngBounds(new L.LatLng(39.948527, -75.192388), new L.LatLng(40.021831, -75.023735));
var map = L.map('map-samples', {
    center: [39.974259, -75.128513],
    zoom: 14,
    layers: [base],
    //minZoom: 14,
    maxBounds: bounds
});



// var radius = L.geoJson(soil_scrubbedData, {
//     pointToLayer: function(feature, latlng) {
//         return L.circle(latlng, {
//             radius: 500,
//             color: "#777",
//             weight: 1,
//             dashArray: 5,
//             opacity: 1,
//             fillOpacity: 0,
//         });
//     }
// });

var oldLayer = ""; // to start, declare an empty variable outside of the function scope


function samplePopup(feature, layer) {
    // layer.on('click', function(e) {
    //     var layer = e.target;
    //     layer.setIcon(layer.options.icon = soilIcon2);
    //     // only attempt to change oldLayer icon back to original if oldLayer defined
    //     if (oldLayer) oldLayer.setIcon(layer.options.icon = soilIcon1);
    //     // keep a reference to switch the icon back on the next click
    //     oldLayer = layer;
    // });
    var popup = "<div class='popup-container'><div class='popup-headline'><span>In the vicinity of</span><br>" + feature.properties.Address + "</div><div class='popup-text'><div style='margin:3px 0 5px; font-weight:bold;'>Soil Sample Results</div>";
    for (i = 0; i < feature.properties.results.length; i++) {
        feature.properties.results.sort(function(a, b) {
            return b - a
        });
        if (feature.properties.results[i] > 399) {
            popup += "<div class='soilrow soilred' data-score='" + feature.properties.results[i] + "'>" + feature.properties.results[i] + " (ppm)</div>"
        } else {
            popup += "<div class='soilrow' data-score='" + feature.properties.results[i] + "'>" + feature.properties.results[i] + " (ppm)</div>"
        }
    }
    popup += "</div></div>";

    layer.bindPopup(popup);
    //map.addLayer(radius);
}
$(".soilrow").each(function() {
    if ($(this).attr('data-score') > 400) {
        $(this).css("color", "red"); // Or whatever
    }
});


var soil_scrubbed = L.geoJson(soil_scrubbedData, {
    pointToLayer: function(feature, latlng) {
        soilIcon = L.divIcon({
            className: "case",
            html: "<div class='marker-inner' data-score='" + Math.max.apply(Math, feature.properties.results) + "'></div>"
        });
        var sample = (feature.properties.results);
        sample.sort(function(a, b) {
            return b - a
        });
        return L.marker(latlng, {
            icon: soilIcon
        });
    },
    onEachFeature: samplePopup
}).addTo(map);




$(".marker-inner[data-score]").each(function() {
    if ($(this).attr('data-score') <= 399) {
        $(this).parent().css("background-color", "#e0e0e0");
        $(this).parent().addClass("toggle400");
    }
    if ($(this).attr('data-score') >= 400 && $(this).attr('data-score') <= 999) {
        $(this).parent().css("background-color", "#fee090");
    }
    if ($(this).attr('data-score') >= 1000 && $(this).attr('data-score') <= 1599) {
        $(this).parent().css("background-color", "#f46d43");
    }
    if ($(this).attr('data-score') >= 1600 && $(this).attr('data-score') <= 1999) {
        $(this).parent().css("background-color", "#d73027");
    }
    if ($(this).attr('data-score') >= 2000) {
        $(this).parent().css("background-color", "#a50026");
    }
});



function smelterPopup(feature, layer) {
    layer.bindPopup("<div class='popup-headline'>" + feature.properties.Site + "</div><i>" + feature.properties.Address + "</i>");
}

var smelters_local = L.geoJSON(smelters_localData, {
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
});
var outerRadius,
    innerRadius;

soil_scrubbed.on("click", function(event) {
    if (outerRadius) {
        outerRadius.setLatLng(event.latlng);
        innerRadius.setLatLng(event.latlng);
        return;
    }


    outerRadius = L.circle(event.latlng, {
        className: "outerRadius",
        radius: 400,
        color: "#777",
        weight: 1,
        dashArray: 5,
        opacity: 1,
        fillOpacity: 0.1,
    }).addTo(map).on("click", function() {
        event.originalEvent.stopPropagation();
    });
    innerRadius = L.circle(event.latlng, {
        className: "innerRadius",
        radius: 200,
        color: "#777",
        weight: 1,
        dashArray: 5,
        opacity: 1,
        fillOpacity: 0,
    }).addTo(map).on("click", function() {
        event.originalEvent.stopPropagation();
    });
});

var toggle = true;


function togglePoints() {
    if (!toggle) {
        map.removeLayer(smelters_local);
    } else {
        map.addLayer(smelters_local);
    }
    toggle = !toggle;
}

$("#smelter-button").click(function() {
    togglePoints();
});

$("#low-button").click(function() {
    $(".toggle400").toggle();
});


L.control.scale().addTo(map);

map.scrollWheelZoom.disable();
map.touchZoom.disable();
