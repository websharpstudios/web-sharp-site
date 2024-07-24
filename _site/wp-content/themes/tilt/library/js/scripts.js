
var $ = jQuery.noConflict();

/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y }
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;


function resizeRows() {
	$('.row-wrapper.fixed_height').each(function() {
		var $this = $(this),
			height = $this.data('height'),
			windowHeight = updateViewportDimensions(),
			wH = windowHeight.height;

		if ( $('#wpadminbar').length ) wH -= $('#wpadminbar').height();
		if ( $('.preview__header').length ) wH -= $('.preview__header').height();

		$this.css({height: wH * height / 100 + 'px'});
	});
}

$(window).resize(function () {

	waitForFinalEvent( function() {
		resizeRows();
		customSlopeHeight();

		$(videoSDiv).each(function(){
			videoSectionSize($(this));
		});

		$('.bg-vimeo').each(function(){
			vimeoSize($(this));
		});

		$('.bg-youtube').each(function(){
			youtubeSize($(this));
		});

	}, timeToWaitForLast, "your-function-identifier-string"); });

/*
 * Here's an example so you can see how we're using the above function
 *
 * This is commented out so it won't work, but you can copy it and
 * remove the comments.
 *
 *
 *
 * If we want to only do it on a certain page, we can setup checks so we do it
 * as efficient as possible.
 *
 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
 *
 * This once checks to see if you're on the home page based on the body class
 * We can then use that check to perform actions on the home page only
 *
 * When the window is resized, we perform this function
 * $(window).resize(function () {
 *
 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
 *    if( is_home ) { waitForFinalEvent( function() {
 *
 *      // if we're above or equal to 768 fire this off
 *      if( viewport.width >= 768 ) {
 *        console.log('On home page and window sized to 768 width or more.');
 *      } else {
 *        // otherwise, let's do this instead
 *        console.log('Not on home page, or window sized to less than 768.');
 *      }
 *
 *    }, timeToWaitForLast, "your-function-identifier-string"); }
 * });
 *
 * Pretty cool huh? You can create functions like this to conditionally load
 * content and other stuff dependent on the viewport.
 * Remember that mobile devices and javascript aren't the best of friends.
 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
 *
*/

/*
 * We're going to swap out the gravatars.
 * In the functions.php file, you can see we're not loading the gravatar
 * images on mobile to save bandwidth. Once we hit an acceptable viewport
 * then we can swap out those images since they are located in a data attribute.
*/
function loadGravatars() {
  // set the viewport using the function above
  viewport = updateViewportDimensions();
  // if the viewport is tablet or larger, we load in the gravatars
  if (viewport.width >= 768) {
  jQuery('.comment img[data-gravatar]').each(function(){
    jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
  });
	}
} // end function



/*********************
iOS submenu fix
*********************/
function submenu_fix() {
	$('#site-navigation .menu-container > ul > li, #site-navigation .menu-container > ul > li:not(.megamenu) > .sub-menu > li').bind('touchstart touchend', function(e) {
		$(this).toggleClass('mhover');
	});
}



/*********************
 Info box hover fix
 *********************/
function el_hover_fix() {
	$('.twc_ib_container').bind('touchstart touchend', function(e) {
		$(this).toggleClass('mhover');
	});

	$('.twc_image_box .twc_imb_inner').bind('touchstart touchend', function(e) {
		$(this).toggleClass('mhover');
	});
}



/*********************
Search button
*********************/
function searchButton() {

	// Header search toggle
	$('#trigger-header-search, .widget_search, .error-search').on('click', function () {
		var overlay = $('#wrapper > .searchform-overlay'),
			overlayInner = $('#wrapper > .searchform-overlay > .searchform-overlay-inner');
		overlay.addClass('header-search-active');
		setTimeout(function () {
			$('.search-input').focus();
		}, 300);

		overlayInner.unbind().on('click', function (e) {
			if (overlayInner.is(e.target)) // ... nor a descendant of the container
			{
				overlay.removeClass('header-search-active');
				$('.search-input').val('');
				$(document).unbind('keyup');
			}
		});

		$(document).unbind().keyup(function (e) {
			if (e.keyCode == 27) {
				overlayInner.trigger('click');
			}
		});
	});
}



/*********************
Sticky header
*********************/
function stickyHeader() {
	if ( $('.sticky-enabled').length ) {

		$(window).scroll(function() {
			var scrolled            = $(this).scrollTop(),
				headerOffset        = $('#site-header').offset().top;

			if ( $('#top-bar').length ) {
				headerOffset -= parseInt($('#wrapper').css('padding-top'));
				viewport = updateViewportDimensions();

				if (viewport.width <= 600 && $('.admin-bar').length) {
					headerOffset += $('#top-bar').height();
				}
			}

			if(scrolled > headerOffset ) {
				$('#header-wrapper').addClass('header-sticked');
				$('#title-slope').addClass('title-header-sticked');
				$('#site-header').addClass('header-container-sticked');

				if ( $('.sticked-light').length ) {
					$('#site-header').addClass('sticked-menu-light');
				}

				if ( $('.sticked-dark').length ) {
					$('#site-header').addClass('sticked-menu-dark');
				}
			} else {
				$('#header-wrapper').removeClass('header-sticked');
				$('#title-slope').removeClass('title-header-sticked');
				$('#site-header').removeClass('header-container-sticked');

				$('#site-header').removeClass('sticked-menu-light');
				$('#site-header').removeClass('sticked-menu-dark');
			}
		});
	}
}



/*********************
Parallax background
*********************/

var offsets = {};

function scrollEvent(){

	var windowHeight    = $(window).height();

	$('.parallax-bg, .scale-bg').each(function(){
		var $this       = $(this),
			scrollTop   = $(window).scrollTop(),
			bottom      = windowHeight + scrollTop,
			offset      = $this.closest('.main_row').offset().top,
			height      = $this.outerHeight(),
			parSpeed    = $this.attr('data-parallax-speed'),
			scaleSpeed  = $this.attr('data-scaling-speed'),
			maxOffset   = offset + windowHeight,
			newHeight   = Math.round(($this.closest('.main_row').outerHeight() + (windowHeight * parSpeed)) / $this.closest('.main_row').outerHeight() * 100);

		// Check if above or below viewport
		if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
			return;
		}

		var position    = - Math.round((offset - scrollTop) * parSpeed * 10000) / 10000,
			maxScale    = windowHeight + $this.closest('.main_row').outerHeight(),
			step        = scaleSpeed / maxScale,
			scale       = 1 + (scrollTop + windowHeight - offset) * step;

		if ( $this.hasClass('parallax-bg') ) {
			if ( $this.hasClass('scale-bg') ) {
				$this.css({'transform':'translate3d(0, ' + position +'px,0) scale(' + scale + ')',
							'-webkit-transform':'translate3d(0, ' + position +'px,0) scale(' + scale + ')'});
			} else {
				$this.css({'transform':'translate3d(0, ' + position +'px,0)',
							'-webkit-transform':'translate3d(0, ' + position +'px,0)'});
			}
		} else if ( $this.hasClass('scale-bg') ) {
			$this.css({'transform':'scale(' + scale + ')'});
		}

		$this.css({'height': newHeight + '%' });
		$this.removeClass('bg-init');
	});

	$('.bg-image').each(function(){
		if ( ! $(this).hasClass('parallax-bg') && ! $(this).hasClass('scale-bg') ) {
			$(this).removeClass('bg-init');
		}
	});

	$('.content-fadeout').each(function(index) {
		var $this       = $(this),
			scrollTop   = $(window).scrollTop(),
			bottom      = windowHeight + scrollTop,
			offset      = $this.closest('.main_row').offset().top,
			el_offset   = $this.offset().top,
			cont_height = $this.closest('.main_row').outerHeight(),
			el_height   = $this.innerHeight(),
			offset_bot  = (el_offset - offset) + el_height,
			add_space   = $('#main').offset().top + $('#header-wrapper').height();

		var shift;
		if (isNaN(offsets[index])) {
			shift = 0;
		} else {
			shift = offsets[index];
		}

		if ( $this.closest('.main_row').find('.slope-bottom-inside').length ) {
			add_space -= $this.closest('.main_row').find('.slope-bottom-inside').height() / 2;
		}

		var speed       = (cont_height - ((el_offset - offset) + el_height) + shift + add_space) / (cont_height);

		// Check if above or below viewport
		if (offset + cont_height <= scrollTop || offset >= scrollTop + windowHeight) {
			return;
		}

		var position    = - Math.round((offset - scrollTop) * speed * 10000) / 10000,
			maxScale    = $this.closest('.main_row').outerHeight(),
			step        = - 1.5 / maxScale,
			opacity     = 1 - Math.round((offset - scrollTop) * step * 10000) / 10000;

		if (opacity > 1) opacity = 1;
		if (position < 0) position = 0;

		$this.css({ 'transform' : 'translate3d(0, ' + position +'px,0)',
					'-webkit-transform' : 'translate3d(0, ' + position +'px,0)',
					'opacity'   : opacity
		});

		offsets[index] = position;
	});
}



/*********************
Video section
*********************/
var videoSDiv = '.bg-video video';

function videoSectionSize(mediaElement) {
	var $this = $(mediaElement);
	$this.attr('style','');
	var wW = $this.width();
	var wH = $this.height();
	var pW = $this.closest('.bg-video').width();
	var pH = $this.closest('.bg-video').height();
	var wR = wW/pW;
	var hR = wH/pH;
	var scale = Math.min(wR,hR);
	var rW = (wW/scale);
	var rH = (wH/scale);
	var leftI = -Math.abs((rW-pW)/2);
	if ( wH > pH ) {
		var topI = (pH-wH)/2;
	} else {
		var topI = 0;
	}

	$this.attr('width','');
	$this.attr('height','');
	$this.attr('style', 'height: auto !important; width: '+rW+'px !important; left: '+leftI+'px !important; top: '+topI+'px !important;');
	videoSection(videoSDiv);
}



/*********************
 Vimeo background
 *********************/
function vimeoSize(video) {

	var $this   = $(video),
		$iframe = $this.find('iframe');

	if ( $this.length ) {
		var wW = $iframe.data('width') || $iframe.width();
		var wH = $iframe.data('height') || $iframe.height();
		var pW = $this.closest('.bg-video').width();
		var pH = $this.closest('.bg-video').height();
		var wR = wW/pW;
		var hR = wH/pH;
		var scale = Math.min(wR,hR);
		var rH = (wH/scale)+200;
		var rW = (wW/scale)+200/wH*wW;
		//var rH = (wH/scale);
		//var rW = (wW/scale);
		var leftI = -Math.abs((rW-pW)/2);
		if ( rH > pH ) {
			var topI = (pH-rH)/2;
		} else {
			var topI = 0;
		}

		var direction = $('html').attr('dir'),
			left	  = 'margin-left';

		if ( direction === 'rtl' ) {
			left = 'margin-right';
		}

		$this.find('iframe').attr('style', 'height: '+rH+'px; width: '+rW+'px; '+left+': '+leftI+'px; margin-top: '+topI+'px;');
		setTimeout(function() {
			$('.bg-vimeo').closest('.bg-video').animate({'opacity': 1}, 500);
		},500);

		if (window.addEventListener) {
			window.addEventListener('message', onMessageReceived, false);
		} else {
			window.attachEvent('onmessage', onMessageReceived, false);
		}

		function onMessageReceived(e) {
			var origin = e.origin || e.originalEvent.origin;
			if (  origin === 'https://player.vimeo.com' && origin === 'http://player.vimeo.com' ) {
				return;
			}

			var data = JSON.parse(e.data);
			switch (data.event) {
				case 'ready':
					$('iframe.vimeo-player').each(function(index, element) {
						var $f = $(this),
							url = 'https:'+$f.attr('src').split('?')[0];
						var data = { method: 'setVolume', value: '0' };
						$f[0].contentWindow.postMessage(JSON.stringify(data), url);
						$(this).closest('.bg-video').addClass('poster-hidden');
					});
					break;
			}
		}
	}
}



/*********************
 Youtube background
 *********************/

function startYoutubeInit() {
	$('.bg-youtube').each(function() {
		var $row 		= $(this),
			youtubeId 	= $row.data('youtube-id');

		if ( youtubeId ) {
			$row.find( '.vc_video-bg' ).remove();
			youtubeInit( $row, youtubeId );
		}
	} );
}

// Insert youtube video into element.
// Video will be w/o controls, muted, autoplaying and looping.
function youtubeInit($element, youtubeId, counter) {
	if ( 'undefined' === typeof( YT.Player ) ) {
		// wait for youtube iframe api to load. try for 10sec, then abort
		counter = 'undefined' === typeof( counter ) ? 0 : counter;
		if ( counter > 100 ) {
			console.warn( 'Too many attempts to load YouTube api' );
			return;
		}

		setTimeout( function () {
			youtubeInit( $element, youtubeId, counter ++ );
		}, 100 );

		return;
	}

	var player,
		$container = $element.prepend( '<div class="youtube-player"></div>' ).find( '.youtube-player' );

	player = new YT.Player( $container[ 0 ], {
		width: '100%',
		height: '100%',
		videoId: youtubeId,
		playerVars: {
			playlist: youtubeId,
			iv_load_policy: 3, // hide annotations
			enablejsapi: 1,
			disablekb: 1,
			autoplay: 1,
			controls: 0,
			showinfo: 0,
			rel: 0,
			loop: 1
		},
		events: {
			onReady: function ( event ) {
				event.target.mute().setLoop( true );
				$element.closest('.bg-video').addClass('poster-hidden');
			}
		}
	} );

	youtubeSize( $element );
}

// Resize background video iframe so that video content covers whole area
function youtubeSize( $element ) {
	var iframeW,
		iframeH,
		marginLeft,
		marginTop,
		containerW = $element.closest('.bg-video').innerWidth(),
		containerH = $element.closest('.bg-video').innerHeight(),
		ratio1 = 16,
		ratio2 = 9;

	if ( ( containerW / containerH ) < ( ratio1 / ratio2 ) ) {
		iframeW = containerH * (ratio1 / ratio2);
		iframeH = containerH;

		marginLeft = - Math.abs( ( iframeW - containerW ) / 2 ) + 'px';
		marginTop = - Math.abs( ( iframeH - containerH ) / 2 ) + 'px';

		iframeW += 'px';
		iframeH += 'px';
	} else {
		iframeW = containerW;
		iframeH = containerW * (ratio2 / ratio1);

		marginTop = - Math.round( ( iframeH - containerH ) / 2 ) + 'px';
		marginLeft = - Math.round( ( iframeW - containerW ) / 2 ) + 'px';

		iframeW += 'px';
		iframeH += 'px';
	}

	$element.find('iframe').css( {
		maxWidth: '1000%',
		marginLeft: marginLeft,
		marginTop: marginTop,
		width: iframeW,
		height: iframeH
	} );
}

// Extract video ID from youtube url
function vcExtractYoutubeId( url ) {
	if ( 'undefined' === typeof(url) ) {
		return false;
	}

	var id = url.match( /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/ );

	if ( null != id ) {
		return id[ 1 ];
	}

	return false;
}



/*********************
 Self-hosted video
 *********************/
function videoSection(mediaElement) {

	if ($(mediaElement).length) {
		videosSection = [];
		$(mediaElement).mediaelementplayer({
			features: ['volume'],
			pauseOtherPlayers: false,
			loop: true,
			startVolume: 0.0,
			success: function(mediaElement, domObject) {
				mediaElement.addEventListener('play', function(e) {
					$(mediaElement).closest('.bg-video').addClass('poster-hidden');
				});
				videosSection.push(mediaElement);
				mediaElement.pause();
				mediaElement.load();
				mediaElement.addEventListener('loadeddata', function(e) {
					videoSectionSize(mediaElement);
					mediaElement.play();
				});
			},
			error:  function(domObject) {
				$(domObject).closest('.mejs-container').remove();
			}
		});
	}
}



/*********************
 Custom slope height
 *********************/
function customSlopeHeight() {
	$('.custom-slope-tablet, .custom-slope-mobile').each(function() {
		var heightT	= $(this).data('slope-tablet'),
			heightM	= $(this).data('slope-mobile'),
			$slope	= $(this).find('.row-slope'),
			windowW	= updateViewportDimensions().width;

		if ( windowW < 768 ) {
			if ( $(this).hasClass('custom-slope-mobile') && heightM !== '' && $slope.length ) {
				$slope.css({'max-height': heightM});
			}
		} else if ( windowW < 979 ) {
			if ( $(this).hasClass('custom-slope-tablet') && heightT !== '' && $slope.length ) {
				$slope.css({'max-height': heightT});
			}
		} else {
			$slope.css({'max-height': ''});
		}

	});
}


/*********************
To-Top navigation
*********************/
function toTop() {
	$('a[href="#top"]').on('click', function(e) {
		e.preventDefault();
		windowHeight = updateViewportDimensions();
		var speed   = 2,
			time    = Math.abs($(window).scrollTop()) / speed;
		$('html, body').animate({scrollTop:0}, time);
	});

	$(window).scroll(function(){
		windowHeight = updateViewportDimensions();
		if ( $(window).scrollTop() > windowHeight.height / 2) {
			$('.scrollToTop').removeClass('invisible');
		} else {
			$('.scrollToTop').addClass('invisible');
		}
	});
}



/*********************
One-Page Menu Navigation
 *********************/
function toSection() {
	$(document).ready(function () {
		var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		if (window.location.hash && isChrome) {
			setTimeout(function () {
				var hash = window.location.hash;
				window.location.hash = "";
				window.location.hash = hash;
			}, 300);
		}
	});

	$("a[href*='#']").click(function(e) {
		var link = $(this)[0].hash;

		var newPath		= $(this)[0].href.match(/(^[^#]*)/)[0],
			currPath	= window.location.href.match(/(^[^#]*)/)[0],
			href		= $(this).attr('href');

		if ( $(this).closest('#mobile-site-navigation').length &&
			!$(this).is('a[href="#mobile-site-navigation"]') &&
			currPath === newPath &&
			!$(this).is('.mm-subopen') &&
			!$(this).attr('href') !== '' ) {
			e.preventDefault();
			var menu = $("#mobile-site-navigation").data( "mmenu" );
			menu.close();
			e.preventDefault();
			sectionScroll(link, true);
		}

		if ( !$(this).closest('#mobile-site-navigation').length &&
			  $(link).length && !$(this).hasClass('ui-tabs-anchor') &&
			 !$(this).find('.vc_tta-title-text').length &&
			 !$(this).closest('ul').hasClass('wc-tabs') &&
			 currPath === newPath  &&
			$(this).attr('href') !== '' ) {
			e.preventDefault();
			sectionScroll(link, true);
		}
	});

	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}

	if(history.pushState) {
		window.onpopstate = function(e) {
			if (e.state) {
				var hash = e.state.hash;
				if ( $(hash).length ) {
					sectionScroll(hash, false);
				}
			}
		};
	} else {
		window.onhashchange = function(e) {
			var hash = window.location.hash;
			if ( $(hash).length ) {
				sectionScroll(hash, true);
			}
		};
	}

	// Cache selectors
	var lastId,
		topMenu = $("#site-navigation"),
		topMenuHeight = topMenu.outerHeight()+15,
		// All list items
		menuItems = topMenu.find('a'),
		// Anchors corresponding to menu items
		scrollItems = menuItems.map(function(){
			var item = $($(this)[0].hash);
			var newPath		= $(this)[0].href.match(/(^[^#]*)/)[0],
				currPath	= window.location.href.match(/(^[^#]*)/)[0];
			if (item.length && newPath === currPath) {
				return item;
			}
		});

	// Bind to scroll
	$(window).scroll(function(){
		// Get container scroll position
		var fromTop = $(this).scrollTop()+topMenuHeight;

		// Get id of current scroll item
		var cur = scrollItems.map(function(){
			if ($(this).offset().top < fromTop) {
				return this;
			}
		});
		// Get the id of the current element
		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";

		if (lastId !== id && id !== '') {
			lastId = id;
			// Set/remove active class
			menuItems
				.parent().removeClass("current-menu-ancestor")
				.end().filter('[href*="#'+id+'"]').parent().addClass("current-menu-ancestor");
		}
	});

	var menuLinks = $("#site-navigation .menu-container").find('a');
	menuLinks.each(function() {
		var hash	= $(this)[0].hash;
		if ( hash !== '' ) {
			$(this).closest('.current-menu-item').removeClass('current-menu-item');
			$(this).closest('.current-menu-ancestor').removeClass('current-menu-ancestor');
		}
	});
	setTimeout(function() {
		$('#site-header').removeClass('header-hidden');
	},500);
}



// scroll
function collarsTabsMobile() {
	var $nav = $('.twc-tab-nav-mobile');

	$nav.on('click', function(e) {
		e.preventDefault();

		var link = $(this).attr('href');

		if ( !$(this).parent('li').hasClass('ui-tabs-active ui-state-active') ) {
			$(this).closest('.wpb_tour_tabs_wrapper').find('a[href="'+link+'"]:not(.twc-tab-nav-mobile)').trigger('click');
			$(this).closest('.wpb_tour_tabs_wrapper').find('.twc-tab-nav-mobile').parent('li').removeClass('ui-tabs-active ui-state-active');
			$(this).parent('li').addClass('ui-tabs-active ui-state-active');
		}
	})
}




// scroll
function sectionScroll(link, scroll) {

	if ( $(link).length ) {
		var speed   = 2,
			offset  = $(link).offset().top - $('#header-wrapper').height(),
			time    = Math.abs($(window).scrollTop() - offset) / speed,
			$body	= $('body');

		if ( !$body.hasClass('scrolling') ) {
			$body.addClass('scrolling');
			$('html, body').animate({scrollTop: offset}, time, function(){
				if(history.pushState) {
					if ( $body.hasClass('scrolling') ) {
						if (scroll) {
							history.pushState({hash: link}, null, link);
						}
						$body.removeClass('scrolling');
					}
				} else {
					if ( $body.hasClass('scrolling') ) {
						parent.location.hash = link;
						$body.removeClass('scrolling');
					}
				}
			});
		}

	}
}



/*********************
Button Hover Animation
 *********************/
function buttonHover() {

	$('.twc_custom_button').each(function(){
		var $this			= $(this),
			textColor		= $this.css('color'),
			bgColor			= $this.css('background-color'),
			borderColor		= $this.css('border-color'),
			borderRadius	= $this.css('border-radius');

		$this.mouseenter(function() {
			var textColorH		= $this.data('hc'),
				bgColorH		= $this.data('hbgc'),
				borderColorH	= $this.data('hbc'),
				borderRadiusH	= $this.data('hbr');

			$this.css({
				color			: textColorH,
				backgroundColor : bgColorH,
				borderColor		: borderColorH,
				borderRadius	: borderRadiusH
			}, 200 );

			$this.mouseleave(function() {
				$this.css({
					color			: textColor,
					backgroundColor : bgColor,
					borderColor		: borderColor,
					borderRadius	: borderRadius
				}, 200 );
				$this.unbind('mouseleave');
			});
		});
	});
}



/*********************
Modal Window
 *********************/

function modalWindow() {
	$('.twc_modal_window').each(function() {
		// move modal to body and remove the containing row
		var $this 	= $(this),
			$row	= $this.closest('.wpb_row');
		$this.appendTo('body');
		$row.remove();

		$this.find('.twc_mw_close').on('click', function() {
			$this.modal('hide');
		});
	});


	// handle modal trigger
	$("a[href^='#modal-']").click(function(e) {
		e.preventDefault();

		// get the target
		var link 	= $(this).attr('href');
		link		= link.substring(link.indexOf("#modal-") + 7);
		var $target	= $('.twc_modal_window#'+link);

		if ( $($target).length ) {
			$target.modal('show');

			// show modal
			$('body').addClass('modal-open');

			// add blur to background
			if ($target.hasClass('blur') || $target.hasClass('color_blur')) {
				$('#wrapper').addClass('modal-blur');
			}

			// remove blur on modal close
			$target.on('hidden.bs.modal', function (e) {
				$('#wrapper').removeClass('modal-blur');
			})
		}
	});
}

// Bootstrap Modal
+function ($) {
	'use strict';

	// MODAL CLASS DEFINITION
	// ======================

	var Modal = function (element, options) {
		this.options             = options
		this.$body               = $(document.body)
		this.$element            = $(element)
		this.$dialog             = this.$element.find('.modal-dialog')
		this.$backdrop           = null
		this.isShown             = null
		this.originalBodyPad     = null
		this.scrollbarWidth      = 0
		this.ignoreBackdropClick = false

		if (this.options.remote) {
			this.$element
				.find('.modal-content')
				.load(this.options.remote, $.proxy(function () {
					this.$element.trigger('loaded.bs.modal')
				}, this))
		}
	}

	Modal.VERSION  = '3.3.5'

	Modal.TRANSITION_DURATION = 300
	Modal.BACKDROP_TRANSITION_DURATION = 150

	Modal.DEFAULTS = {
		backdrop: true,
		keyboard: true,
		show: true
	}

	Modal.prototype.toggle = function (_relatedTarget) {
		return this.isShown ? this.hide() : this.show(_relatedTarget)
	}

	Modal.prototype.show = function (_relatedTarget) {
		var that = this
		var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

		this.$element.trigger(e)

		if (this.isShown || e.isDefaultPrevented()) return

		this.isShown = true

		this.checkScrollbar()
		this.setScrollbar()
		this.$body.addClass('modal-open')

		this.escape()
		this.resize()

		this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

		this.$dialog.on('mousedown.dismiss.bs.modal', function () {
			that.$element.one('mouseup.dismiss.bs.modal', function (e) {
				if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
			})
		})

		this.backdrop(function () {
			var transition = $.support.transition && that.$element.hasClass('fade')

			if (!that.$element.parent().length) {
				that.$element.appendTo(that.$body) // don't move modals dom position
			}

			that.$element
				.show()
				.scrollTop(0)

			that.adjustDialog()

			if (transition) {
				that.$element[0].offsetWidth // force reflow
			}

			that.$element.addClass('in')

			that.enforceFocus()

			var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

			transition ?
				that.$dialog // wait for modal to slide in
					.one('bsTransitionEnd', function () {
						that.$element.trigger('focus').trigger(e)
					})
					.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
				that.$element.trigger('focus').trigger(e)
		})
	}

	Modal.prototype.hide = function (e) {
		if (e) e.preventDefault()

		e = $.Event('hide.bs.modal')

		this.$element.trigger(e)

		if (!this.isShown || e.isDefaultPrevented()) return

		this.isShown = false

		this.escape()
		this.resize()

		$(document).off('focusin.bs.modal')

		this.$element
			.removeClass('in')
			.off('click.dismiss.bs.modal')
			.off('mouseup.dismiss.bs.modal')

		this.$dialog.off('mousedown.dismiss.bs.modal')

		$.support.transition && this.$element.hasClass('fade') ?
			this.$element
				.one('bsTransitionEnd', $.proxy(this.hideModal, this))
				.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
			this.hideModal()
	}

	Modal.prototype.enforceFocus = function () {
		$(document)
			.off('focusin.bs.modal') // guard against infinite focus loop
			.on('focusin.bs.modal', $.proxy(function (e) {
				if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
					this.$element.trigger('focus')
				}
			}, this))
	}

	Modal.prototype.escape = function () {
		if (this.isShown && this.options.keyboard) {
			this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
				e.which == 27 && this.hide()
			}, this))
		} else if (!this.isShown) {
			this.$element.off('keydown.dismiss.bs.modal')
		}
	}

	Modal.prototype.resize = function () {
		if (this.isShown) {
			$(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
		} else {
			$(window).off('resize.bs.modal')
		}
	}

	Modal.prototype.hideModal = function () {
		var that = this
		this.$element.hide()
		this.backdrop(function () {
			that.$body.removeClass('modal-open')
			that.resetAdjustments()
			that.resetScrollbar()
			that.$element.trigger('hidden.bs.modal')
		})
	}

	Modal.prototype.removeBackdrop = function () {
		this.$backdrop && this.$backdrop.remove()
		this.$backdrop = null
	}

	Modal.prototype.backdrop = function (callback) {
		var that = this
		var animate = 'fade'

		if (this.isShown && this.options.backdrop) {
			var doAnimate = $.support.transition && animate

			this.$backdrop = $(document.createElement('div'))
				.addClass('modal-backdrop ' + animate)
				.css({backgroundColor: this.$element.data('overlay')})
				.appendTo(this.$body)

			this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
				if (this.ignoreBackdropClick) {
					this.ignoreBackdropClick = false
					return
				}
				if (e.target !== e.currentTarget) return
				this.options.backdrop == 'static'
					? this.$element[0].focus()
					: this.hide()
			}, this))

			if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

			this.$backdrop.addClass('in')

			if (!callback) return

			doAnimate ?
				this.$backdrop
					.one('bsTransitionEnd', callback)
					.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
				callback()

		} else if (!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass('in')

			var callbackRemove = function () {
				that.removeBackdrop()
				callback && callback()
			}
			$.support.transition && this.$element.hasClass('fade') ?
				this.$backdrop
					.one('bsTransitionEnd', callbackRemove)
					.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
				callbackRemove()

		} else if (callback) {
			callback()
		}
	}

	// these following methods are used to handle overflowing modals

	Modal.prototype.handleUpdate = function () {
		this.adjustDialog()
	}

	Modal.prototype.adjustDialog = function () {
		var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

		this.$element.css({
			paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
			paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
		})
	}

	Modal.prototype.resetAdjustments = function () {
		this.$element.css({
			paddingLeft: '',
			paddingRight: ''
		})
	}

	Modal.prototype.checkScrollbar = function () {
		var fullWindowWidth = window.innerWidth
		if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
			var documentElementRect = document.documentElement.getBoundingClientRect()
			fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
		}
		this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
		this.scrollbarWidth = this.measureScrollbar()
	}

	Modal.prototype.setScrollbar = function () {
		var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
		this.originalBodyPad = document.body.style.paddingRight || ''
		if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
		if (this.bodyIsOverflowing) $('#header-wrapper').css('padding-right', this.scrollbarWidth);
	}

	Modal.prototype.resetScrollbar = function () {
		this.$body.css('padding-right', this.originalBodyPad)
		$('#header-wrapper').css('padding-right', 0);
	}

	Modal.prototype.measureScrollbar = function () { // thx walsh
		var scrollDiv = document.createElement('div')
		scrollDiv.className = 'modal-scrollbar-measure'
		this.$body.append(scrollDiv)
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
		this.$body[0].removeChild(scrollDiv)
		return scrollbarWidth
	}


	// MODAL PLUGIN DEFINITION
	// =======================

	function Plugin(option, _relatedTarget) {
		return this.each(function () {
			var $this   = $(this)
			var data    = $this.data('bs.modal')
			var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

			if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
			if (typeof option == 'string') data[option](_relatedTarget)
			else if (options.show) data.show(_relatedTarget)
		})
	}

	var old = $.fn.modal

	$.fn.modal             = Plugin
	$.fn.modal.Constructor = Modal


	// MODAL NO CONFLICT
	// =================

	$.fn.modal.noConflict = function () {
		$.fn.modal = old
		return this
	}


	// MODAL DATA-API
	// ==============

	$(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
		var $this   = $(this)
		var href    = $this.attr('href')
		var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
		var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

		if ($this.is('a')) e.preventDefault()

		$target.one('show.bs.modal', function (showEvent) {
			if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
			$target.one('hidden.bs.modal', function () {
				$this.is(':visible') && $this.trigger('focus')
			})
		})
		Plugin.call($target, option, this)
	})

}(jQuery);

+function ($) {
	'use strict';

	// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
	// ============================================================

	function transitionEnd() {
		var el = document.createElement('bootstrap')

		var transEndEventNames = {
			WebkitTransition : 'webkitTransitionEnd',
			MozTransition    : 'transitionend',
			OTransition      : 'oTransitionEnd otransitionend',
			transition       : 'transitionend'
		}

		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return { end: transEndEventNames[name] }
			}
		}

		return false // explicit for ie8 (  ._.)
	}

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function (duration) {
		var called = false
		var $el = this
		$(this).one('bsTransitionEnd', function () { called = true })
		var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
		setTimeout(callback, duration)
		return this
	}

	$(function () {
		$.support.transition = transitionEnd()

		if (!$.support.transition) return

		$.event.special.bsTransitionEnd = {
			bindType: $.support.transition.end,
			delegateType: $.support.transition.end,
			handle: function (e) {
				if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
			}
		}
	})

}(jQuery);






(function() {
	"use strict";

	jQuery(document).ready(function($) {

		// Trigger scroll
		setTimeout( function(){
			$(window).scroll().trigger('resize');
		}, 500 );

		function draw() {
			//requestAnimationFrame(draw);
			// Drawing code goes here
			//scrollEvent();

			$(window).scroll(function(){
				scrollEvent();
			});
		}

		draw();

		submenu_fix();

		el_hover_fix();

	    loadGravatars();

		searchButton();

		stickyHeader();

		videoSectionSize($('.bg-video video'));

		vimeoSize($('.bg-vimeo'));

		startYoutubeInit();

		toTop();

		toSection();

		resizeRows();

		buttonHover();

		modalWindow();

		collarsTabsMobile();

	}); /* end of as page load scripts */

})(jQuery);
