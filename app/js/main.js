// var ScrollMagic = require("scrollmagic");
var _ = require("lodash");







$header = $("header");
$navbar = $("#toxiccitynav");

var headerIntro_bottom = $(window).scrollTop() + $(window).height();

$(document).ready(function() {
  require("./graphics/permit-map/main");
  require("./graphics/smelter-map/main");
  require("./graphics/soil-map/main");
  $(window).on('scroll resize', _.throttle(check_if_in_view, 100));
});


$("#openMenu").click(function() {
  $(".dropdown-nav").css("top",$("#toxiccitynav").outerHeight());
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

  if ($(".headerIntro").scrollTop() + $(".headerIntro").outerHeight() + 50 <= window_top_position + $("header").height()) {
    $("#toxiccitynav").addClass("showNav");
  } else {
    $("#toxiccitynav").removeClass("showNav");
  }
}


$( ".graphicExpand-container" ).each(function() {
  $(this).on("click", function(){
      console.log($(this));
  })

});
