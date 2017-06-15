// var ScrollMagic = require("scrollmagic");
var _ = require("lodash");


$(document).ready(function() {
    $header = $("header");
    $navbar = $("#toxiccitynav");

    var headerIntro_bottom = $(window).scrollTop() + $(window).height();

    require("./graphics/permit-map/main");
    require("./graphics/smelter-map/main");
    require("./graphics/soil-map/main");
    $(window).on('scroll resize', _.throttle(check_if_in_view, 100));

    $("#openMenu").click(function() {
        $(".dropdown-nav").css("top", $("#toxiccitynav").outerHeight());
        $(".dropdown-nav").animate({
            marginRight: "0"
        });
        $("#navEffectBackground-nav").fadeIn();
        $("body").css("overflow", "hidden");
    });

    $("#closeMenu, #navEffectBackground-nav").click(function() {
        $(".dropdown-nav").animate({
            marginRight: "-300"
        });
        $("#navEffectBackground-nav").fadeOut();
        $("body").css("overflow", "inherit");
    });



    function check_if_in_view() {
        var window_height = $(window).height();
        var window_top_position = $(window).scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        var backgroundImage = $("#backgroundImage-1");

        $('.lazyload').each(function() {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);
            if ((element_top_position <= window_bottom_position * .98)) {
                $element.addClass('animated');

            } else if (element_bottom_position < window_top_position || element_top_position > window_bottom_position) {
                $element.removeClass('animated');
            }
        });

        if ($(".headerIntro").scrollTop() + $(".headerIntro").outerHeight() + 50 <= window_top_position + $("header").height()) {
            $("#toxiccitynav").addClass("showNav");
        } else {
            $("#toxiccitynav").removeClass("showNav");
        }
    }


    $(".graphicExpand-container").each(function() {
        $(this).on("click", function() {
        })
    });

    $(".expander").each(function() {
        var sidebar = $(this);
        $(this).find(".expand").on("click", function() {
            sidebar.find(".inner-text").toggleClass("expanded");
            sidebar.find(".fa").toggleClass("fa-expanded");
            if (sidebar.find(".etext").text() == "Expand") {
                sidebar.find(".etext").text("Minimize");
            } else if (sidebar.find(".etext").text() == "Minimize") {
                sidebar.find(".etext").text("Expand");
            }
        })
    });

//jared's js

// Get media - with autoplay disabled (audio or video)
var media = $('#video-intro').not("[autoplay='autoplay']");
var tolerancePixel = 40;

function checkMedia(){
    // Get current browser top and bottom
    var scrollTop = $(window).scrollTop() + tolerancePixel;
    var scrollBottom = $(window).scrollTop() + $(window).height() - tolerancePixel;

    media.each(function(index, el) {
        var yTopMedia = $(this).offset().top;
        var yBottomMedia = $(this).height() + yTopMedia;

        if(scrollTop < yBottomMedia && scrollBottom > yTopMedia){ //view explaination in `In brief` section above
            $(this).get(0).play();
        } else {
            $(this).get(0).pause();
        }
    });

    //}
}
$(document).on('scroll', checkMedia);


});
