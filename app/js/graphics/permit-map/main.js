var points = require("./permitpoints.json");
require("./timeline");
// require("./timelineslider");

// var basemapURL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '.png';



var map = L.map('map-permits', {
    zoomControl: true,
    dragging: false,
    minZoom: 13
}).setView([39.974259, -75.128513], 14);

var basemapURL = 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}'+ (L.Browser.retina ? '@2x' : '') +'.png';
L.tileLayer(basemapURL, {
    opacity: 0.7,

    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
}).addTo(map);

// mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

// L.esri.Vector.basemap("Topographic").addTo(map);


map.scrollWheelZoom.disable();
map.touchZoom.disable();

var slider = L.timelineSliderControl({
    steps:11,
    formatOutput: function(date) {
        // console.log(moment(date).format('MMM Y'));
        // return moment(date).format('MMM Y');
        return moment(date).format('Y');

    }
});

map.addControl(slider);


var pointTimeline = L.timeline(points, {
    pointToLayer: function(feature, latlng) {
        var icon = L.divIcon({
            className: 'case',
            html: '<div class="'+feature.properties.permitdescription+'"data-year="' + feature.properties.year + '"></div>'
        });
        return L.marker(latlng, {
            icon: icon,
            start: feature.properties.year,
            end: feature.properties.year
        });
    },
});
pointTimeline.addTo(map);

pointTimeline.on('change', function(e) {
    var current = $(".time-text").val();
    var currentYear = current.substr(current.length - 4);
    var currentYear = Number(currentYear);

    //i = i+1;
    //console.log(tick);
    $(".case .CONSTRUCTION").parent().css("background-color","rgb(197, 209, 118)");
    $(".case .DEMOLITION").parent().css("background-color","#82a6c9");
    $(".case div[data-year]").each(function() {
        if ($(this).attr('data-year') < currentYear) {
            $(this).parent().addClass("past");
            $(this).addClass("past");
        } else {
            $(this).parent().removeClass("past");
            $(this).removeClass("past");

        }
        // var slider_current = $('.time-slider').val(),
        //     slider_min = $('.time-slider').attr("min"),
        //     slider_max = $('.time-slider').attr("max"),
        //     slider_gap = (slider_max-slider_min),
        //     months = (12),
        //     tick = (slider_gap / months),
        //     current_dif = slider_current - slider_min,
        //     current_tick = current_dif / tick,
        //     leftPosition = (current_tick * (100/months)) + "%";
        //     if (currentYear == 2016) {
        //       // $("#trackline").css("left","90%");
        //     } else {
        //     //   $("#trackline").css("left",leftPosition);
        //     }
    });
});


slider.addTimelines(pointTimeline);


$("#playToggle").on("click", function(){
    $(".play").click();
})
