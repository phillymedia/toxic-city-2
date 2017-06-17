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

        $(".video-transition").each(function() {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;


            if ((element_top_position <= window_bottom_position) && $(this).attr("class") !== "video-transition playedinview") {
                $(this).load();
                $(this)[0].play();
                $(this).addClass("playedinview");
                $(this).attr('autoplay', true);
            }

        })

        // $('video').each(function(){
        //     if ($(this).visible( true )) {
        //         $(this)[0].play();
        //     } else {
        //         $(this)[0].pause();
        //     }
        // })

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




!function(t){var i=t(window);t.fn.visible=function(t,e,o){if(!(this.length<1)){var r=this.length>1?this.eq(0):this,n=r.get(0),f=i.width(),h=i.height(),o=o?o:"both",l=e===!0?n.offsetWidth*n.offsetHeight:!0;if("function"==typeof n.getBoundingClientRect){var g=n.getBoundingClientRect(),u=g.top>=0&&g.top<h,s=g.bottom>0&&g.bottom<=h,c=g.left>=0&&g.left<f,a=g.right>0&&g.right<=f,v=t?u||s:u&&s,b=t?c||a:c&&a;if("both"===o)return l&&v&&b;if("vertical"===o)return l&&v;if("horizontal"===o)return l&&b}else{var d=i.scrollTop(),p=d+h,w=i.scrollLeft(),m=w+f,y=r.offset(),z=y.top,B=z+r.height(),C=y.left,R=C+r.width(),j=t===!0?B:z,q=t===!0?z:B,H=t===!0?R:C,L=t===!0?C:R;if("both"===o)return!!l&&p>=q&&j>=d&&m>=L&&H>=w;if("vertical"===o)return!!l&&p>=q&&j>=d;if("horizontal"===o)return!!l&&m>=L&&H>=w}}}}(jQuery);



});
