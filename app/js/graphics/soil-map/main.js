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


var data = require("./newdata.geo.json");
var smelters_localData = require("./newsmelters.geo.json");

var byStreet = {};
var dotList = {};

data.features.sort(function(a, b) {
    return b.properties.result - a.properties.result
})

data.features.forEach(function(feature) {
    feature.properties.indexNum = data.features.indexOf(feature);
    if (feature.properties.result >= 400) {
        $(".sortList").append("<div class='flexrow' data-num='"+feature.properties.indexNum+"'><div class='inline-marker'><div class='marker-inner' data-score='"+feature.properties.result+"'></div></div><div class='flexname'>" + feature.properties.crossStree + " "+feature.properties.siteName+"</div><div class='flexresult'> " + feature.properties.result.toFixed(1) + "</div></div>")
    }

    if (feature.properties && feature.properties.crossStree) {
        var location = feature.properties.crossStree;
        if (!byStreet[location]) byStreet[location] = [];
        byStreet[location].push(feature.properties);
    }

})


// var myIcon = L.divIcon({
//     iconSize: 10,
//     className: 'soil-icon',
//     html: "<div class='marker-inner' data-score='" + Math.max.apply(Math, feature.properties.result) + "'></div>"
// });

var onEachFeature = function onEachFeature(feature, layer) {
    feature.layer = layer;
    var templateData = byStreet[feature.properties.crossStree];

    layer.bindPopup('<div class="popupHead"><span class="intro">In the vicinity of </span>' + feature.properties.crossStree + '</div><ul class="sampleList">All peak soil results:</ul>');


    layer.on('click', function(e) {
        $(".sampleList").empty();
        $(".sampleList").append("All peak soil results:");
        currentItem = feature;
        var index = feature.properties.indexNum;
        layerData = byStreet[currentItem.properties.crossStree];
        layerData.forEach(function(dot) {
            if (dot.result >= 400) {
                $(".sampleList").append("<li class='highppm'>" + dot.result.toFixed(1) + " (ppm)</li>");
            } else {
                $(".sampleList").append("<li>" + dot.result.toFixed(1) + " (ppm)</li>");

            }
        })
    })

    if (feature.properties.result >= 400) {
        dotList[feature.properties.indexNum] = layer;
    }

}

var dots = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
        soilIcon = L.divIcon({
            iconSize: new L.Point(13, 13),
            className: "soil-icon",
            html: "<div class='marker-inner' data-score='" + feature.properties.result + "'></div>"
        });
        data.features.sort(function(a, b) {
            return a.properties.result - b.properties.result
        })
        return L.marker(latlng, {
            icon: soilIcon
        });
    },
    onEachFeature: onEachFeature
}).addTo(map);


map.fitBounds(dots.getBounds());

var listContainer = $(".sortList");

var lastLayer = null;

listContainer.on("click", ".flexrow[data-num]", function() {
    $(".sampleList").empty();
    var dot = this.getAttribute("data-num");
    var layer = dotList[dot];
    if (!layer) return;
    lastLayer = layer;
    layer.openPopup();

    layerData = byStreet[layer.feature.properties.crossStree];
    layerData.forEach(function(dot) {
        if (dot.result >= 400) {
            $(".sampleList").append("<li class='highppm'>" + dot.result.toFixed(1) + " (ppm)</li>");
        } else {
            $(".sampleList").append("<li>" + dot.result.toFixed(1) + " (ppm)</li>");

        }
    })
    map.setView(layer._latlng, 17);


});

$(".marker-inner[data-score]").each(function() {
    if ($(this).attr('data-score') <= 399.9) {
        $(this).parent().css("background-color", "#afafaf");
        $(this).parent().addClass("toggle400 hidetoggle");
    }
    if ($(this).attr('data-score') >= 400 && $(this).attr('data-score') <= 799.9) {
        $(this).parent().css("background-color", "#fed976");
        $(this).parent().addClass("toggle800");

    }
    if ($(this).attr('data-score') >= 800 && $(this).attr('data-score') <= 999.9) {
        $(this).parent().css("background-color", "#fd8d3c");
        $(this).parent().addClass("toggle1000");

    }
    if ($(this).attr('data-score') >= 1000 && $(this).attr('data-score') <= 1999.9) {
        $(this).parent().css("background-color", "#e31a1c");
        $(this).parent().addClass("toggle2000");

    }
    if ($(this).attr('data-score') >= 2000) {
        $(this).parent().css("background-color", "#800026");
        $(this).parent().addClass("togglemax");

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

var toggle = true;

function togglePoints() {
    if (!toggle) {
        map.removeLayer(smelters_local);
    } else {
        map.addLayer(smelters_local);
    }
    toggle = !toggle;
}


// $("#smelter-button").click(function() {
//     togglePoints();
// });
//
// $("#low-button").click(function() {
//     $(".toggle400").toggleClass("hidetoggle");
// });

L.control.scale().addTo(map);

map.scrollWheelZoom.disable();
map.touchZoom.disable();

$("#soil-map-legend .button-row").each(function() {
    $(this).on("click", function() {
        $(this).toggleClass("button-selected");

        var getId = $(this).attr("id");
        if(getId == "ppm-toggle-1") {
                $(".togglemax").toggleClass("hidetoggle");
        }
        if(getId == "ppm-toggle-2") {
                $(".toggle2000").toggleClass("hidetoggle");
        }
        if(getId == "ppm-toggle-3") {
                $(".toggle1000").toggleClass("hidetoggle");
        }
        if(getId == "ppm-toggle-4") {
                $(".toggle800").toggleClass("hidetoggle");
        }
        if(getId == "ppm-toggle-5") {
                $(".toggle400").toggleClass("hidetoggle");
        }
        if(getId == "ppm-toggle-6") {
            togglePoints();
        }
    })

})
