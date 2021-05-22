(function ($) {
	$(document).ready(function () {

		//Scroll to anchor ID
		var elem = $('#' + window.location.hash.replace('#', ''));
		if (elem) {
			//sectionScroll(elem, true);
		}

		// Scroll top for accordion on mobile
		$('#focus-areas .wpb_tabs').on('tabsactivate', function (event, ui) {
			// console.warn(event,ui);
			if ($(window).width() < 768) {
				scrolltoelement(ui.newPanel, 140);
			}
		});

		if ($(window).width() < 768) {
			$('.focus-areas-tabs ul.twc-tabs-nav-mobile').first().find('li').addClass('ui-tabs-active ui-state-active');
		}

		// init controller
		var controller = new ScrollMagic.Controller();

		// build scene
		new ScrollMagic.Scene({
			triggerElement: "#da_bi_enabled",
			triggerHook: 0.2, // show, when scrolled 10% into view
			offset: 50, // move trigger to center of element
			reverse: false // only do once
		})
			.setClassToggle("#processed-card-holder", "fade-in") // add class to reveal
			.addTo(controller);
/* 			.on("enter", () => {
				setTimeout(() => {
					$('#go-button').click();
				}, 1500);
			}); */

		//$('#reliable_data_quality').each(function(i, val) {});
		new ScrollMagic.Scene({
			triggerElement: "#reliable_data_quality",
			triggerHook: 0.65, // show, when scrolled 10% into view
			offset: 50, // move trigger to center of element
			reverse: false // only do once
		})
			.setClassToggle('.speech-bubble', "fade-in") // add class to reveal
			.addTo(controller);		

	});

	var scrolltoelement = function (el, offset) {
		scrollTop = el.offset().top - offset;
		console.log('scrolltop', scrollTop);
		$('html, body').animate({
			scrollTop: scrollTop
		}, 500);
	}


	var sectionScroll = function (link, scroll) {

		if ($(link).length) {
			var speed = 2,
				offset = $(link).offset().top - $('#header-wrapper').height(),
				time = Math.abs($(window).scrollTop() - offset) / speed,
				$body = $('body');

			if (!$body.hasClass('scrolling')) {
				$body.addClass('scrolling');
				$('html, body').animate({ scrollTop: offset }, time, function () {
					if (history.pushState) {
						if ($body.hasClass('scrolling')) {
							if (scroll) {
								history.pushState({ hash: link }, null, link);
							}
							$body.removeClass('scrolling');
						}
					} else {
						if ($body.hasClass('scrolling')) {
							parent.location.hash = link;
							$body.removeClass('scrolling');
						}
					}
				});
			}

		}
	}

// 	var perView = 7;
// 	var width = $('.testimonials').width();

// 	/*var width = $('.glide__track').width();

// 	var testimonialsSlider = new Glide('.glide', {
// 		type: 'carousel',
// 		perView: perView,
// 		startAt: 4,
// 		focusAt: 'center',
// 		perSwipe: '',
// 	});
// 	testimonialsSlider.mount(); */

// 	var testimonialsSlider = new Swiper ('.swiper-container.testimonials', {
//     // Optional parameters
// 		direction: 'horizontal',
// 		effect: 'slide',
// 		speed: 350,
// 		loop: true,
// 		centeredSlides: true,

//     // If we need pagination
// /*     pagination: {
//       el: '.swiper-pagination',
//     }, */

//     // Navigation arrows
//     navigation: {
//       nextEl: '.testimonial-button-next',
//       prevEl: '.testimonial-button-prev',
//     },

//     // And if we need scrollbar
//     scrollbar: {
//       el: '.swiper-scrollbar',
// 		},

// 		// Responsive breakpoints
// 		breakpoints: {
// 			// when window width is >= 320px
// 			320: {
// 				slidesPerView: 1,
// 				spaceBetween: 20
// 			},
// 			// when window width is >= 640px
// 			640: {
// 				slidesPerView: 3,
// 				spaceBetween: 40
// 			},
// 			// when window width is >= 1024px
// 			1024: {
// 				slidesPerView: 5,
// 				spaceBetween: 20
// 			},
// 			// when window width is >= 1120px
// 			1120: {
// 				slidesPerView: perView,
// 				spaceBetween: 10
// 			}
// 		}
// 	});
	
// 	testimonialsSlider.update();

// 	$('.testimonial-button-prev').mouseover(function() {
// 		$('.testimonial-nav-text > .default').removeClass('showDirection');
// 		$('.testimonial-nav-text > .next').removeClass('showDirection');
//     $('.testimonial-nav-text > .prev').addClass('showDirection');
//   });
// 	$('.testimonial-button-next').mouseover(function() {
// 		$('.testimonial-nav-text > .default').removeClass('showDirection');
// 		$('.testimonial-nav-text > .prev').removeClass('showDirection');
// 		$('.testimonial-nav-text > .next').addClass('showDirection');
// 	});
// 	$('[class^="testimonial-button"]').mouseleave(function() {
// 		$('.testimonial-nav-text > *').removeClass('showDirection');
// 		$('.testimonial-nav-text > .default').addClass('showDirection');
// 	});

	// Supercharge Slider

	var superchargeSlider = new Swiper ('.swiper-container.supercharge', {
    // Optional parameters
		direction: 'horizontal',
		effect: 'slide',
		speed: 100,
		slidesPerView: 1,

		// Touch
		shortSwipes: false,
		touchRatio: 0.85,
		longSwipesRatio: 0.35,
		longSwipesMs: 200,
		threshold: 20,

    // If we need pagination
		pagination: {
			el: '.swiper-pagination.supercharge-pagination',
			type: 'custom',
			renderCustom: function (swiper, current, total) {
				let htmlPagination = '';
				$('.swiper-container.supercharge .supercharge-slides').each(function(index) {
					htmlPagination += `
						<div class="pagination-point ${current - 1 === index ? 'active' : ''}" data-index="${index}">
							<span>0${index + 1}</span>
							<div class="pagination-bar-btm"></div>
						</div>
					`;
				})
				return `<div class="pagination-holder">${htmlPagination}</div>`;
			},
			clickable: true,
    }, 

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar.supercharge-scrollbar',
    },
	});

	$('.swiper-container.supercharge').on('click', '.pagination-point', function() {
		let selectedPagination = $(this);
		let index = selectedPagination.data('index');
		superchargeSlider.slideTo(parseInt(index));
	})

})(jQuery);