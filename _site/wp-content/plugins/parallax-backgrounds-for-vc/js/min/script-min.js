// @codekit-append "gambit-fullwidth.js"
// @codekit-append "gambit-fullheight.js"
// @codekit-append "gambit-parallax.js"
// @codekit-append "gambit-video-bg.js"
// @codekit-append "gambit-hover.js"
// @codekit-append "gambit-background.js"


/**
 * Finds the parent VC row. If it fails, it returns a parent that has a class name of *row*.
 * If it still fails, it returns the immediate parent.
 */
document.gambitFindElementParentRow = function( el ) {
	// find VC row
	var row = el.parentNode;
	while ( ! row.classList.contains('vc_row') && ! row.classList.contains('wpb_row') ) {
		if ( row.tagName === 'HTML' ) {
			row = false;
			break;
		}
		row = row.parentNode;
	}
	if ( row !== false ) {
		return row;
	}
	
	// If vc_row & wpb_row have been removed/renamed, find a suitable row
	row = el.parentNode;
	var found = false;
	while ( ! found ) {
		Array.prototype.forEach.call( row.classList, function(className, i) { 
			if ( found ) {
				return;
			}
			if ( className.match(/row/g) ){
				found = true;
				return;
			}
		})
		if ( found ) {
			return row;
		}
		if ( row.tagName === 'HTML' ) {
			break;
		}
		row = row.parentNode;
	}
	
	// Last resort, return the immediate parent
	return el.parentNode;
}



jQuery(document).ready(function($) {
	
	function _isMobile() {
		return navigator.userAgent.match(/Mobi/);
	}
	
	$('.gambit_parallax_row').each(function() {
		
		$(this).gambitImageParallax({
			image: $(this).attr('data-bg-image'),
			direction: $(this).attr('data-direction'),
			mobileenabled: $(this).attr('data-mobile-enabled'),
			mobiledevice: _isMobile(),
			opacity: $(this).attr('data-opacity'),
			width: $(this).attr('data-bg-width'),
			height: $(this).attr('data-bg-height'),
			velocity: $(this).attr('data-velocity'),
			align: $(this).attr('data-bg-align'),
			repeat: $(this).attr('data-bg-repeat'),
			target: $( document.gambitFindElementParentRow( $(this)[0] ) ),
			complete: function() {
			}
		});
	});
});

jQuery(document).ready(function($) {
	"use strict";
	
	function fixFullWidthRows() {
		$('.gambit_fullwidth_row').each(function(i) {
			
			// Find the parent row
			var row = $( document.gambitFindElementParentRow( $(this)[0] ) );

            // Reset changed parameters for contentWidth so that width recalculation on resize will work
            row.css({
				'width': '',
				'position': '',
				'maxWidth': '',
				'left': '',
				'paddingLeft': '',
				'paddingRight': ''
            });
			
			var contentWidth = $(this).attr('data-content-width') || row.children(':not([class^=gambit])').width() + 'px';

			// Make sure our parent won't hide our content
			row.parent().css('overflowX', 'visible');
			
			// Reset the left parameter
			row.css('left', '');
			
			// Assign the new full-width styles
			row.css({
				'width': '100vw',
				'position': 'relative',
				'maxWidth': $(window).width(),
				'left': -row.offset().left
			});
			
			
			if ( contentWidth === '' ) {
				return;
			}
			
			
			// Calculate the required left/right padding to ensure that the content width is being followed
			var padding = 0, actualWidth, paddingLeft, paddingRight;
			if ( contentWidth.search('%') !== -1 ) {
				actualWidth = parseFloat( contentWidth ) / 100 * $(window).width();
			} else {
				actualWidth = parseFloat( contentWidth );
			}
			
			padding = ( $(window).width() - actualWidth ) / 2;
			paddingLeft = padding + parseFloat( row.css('marginLeft' ) );
			paddingRight = padding + parseFloat( row.css('marginRight' ) );
			
			// If the width is too large, don't pad
			if ( actualWidth > $(window).width() ) {
				paddingLeft = 0;
				paddingRight = 0;
			}
			
			row.css({
				'paddingLeft': paddingLeft,
				'paddingRight': paddingRight
			});
			
		});
	}
	
	// setTimeout( function() {
		fixFullWidthRows();
	// }, 2);
	$(window).resize(function() {
		fixFullWidthRows();
		// setTimeout( function() {
			// fixFullWidthRows();
		// }, 2);
	});
});

jQuery(document).ready(function($) {
	"use strict";
	
	function fixFullWidthRows() {
		$('.gambit_fullheight_row').each(function(i) {
			
			// Find the parent row
			var row = $( document.gambitFindElementParentRow( $(this)[0] ) );
			
			var contentWidth = $(this).attr('data-content-location') || 'center';
			
			// We need to add minheight or else the content can go past the row
			row.css('minHeight', row.height() + 60);
			
			// Let CSS do the work for us
			row.addClass('gambit-row-fullheight gambit-row-height-location-' + contentWidth);
		
			// If center, remove top margin of topmost text & bottom margin of bottommost text
			if ( contentWidth === 'center' ) {
				row.find('> .vc_column_container > .wpb_wrapper > .wpb_text_column > .wpb_wrapper > *:first-child')
				.css('marginTop', 0);
				row.find('> .vc_column_container > .wpb_wrapper > .wpb_text_column > .wpb_wrapper > *:last-child')
				.css('marginBottom', 0);
			}
		});
	}
	
	fixFullWidthRows();
});

/**
 * requestAnimationFrame polyfill
 *
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * requestAnimationFrame polyfill under MIT license
 */
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for( var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++x ) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function( callback, element ) {
			return window.setTimeout( function() { callback(); }, 16 );
		};
	}
}());


// Don't re-initialize our variables since that can delete existing values
if ( typeof _gambitImageParallaxImages === 'undefined' ) {
	var _gambitImageParallaxImages = [];
	var _gambitScrollTop;
	var _gambitWindowHeight;
	var _gambitScrollLeft;
	var _gambitWindowWidth;
}


;(function ( $, window, document, undefined ) {
	// Create the defaults once
	var pluginName = "gambitImageParallax",
		defaults = {
			direction: 'up', // fixed
			mobileenabled: false,
			mobiledevice: false,
			width: '',
			height: '',
			align: 'center',
			opacity: '1',
			velocity: '.3',
			image: '', // The background image to use, if empty, the current background image is used
			target: '', // The element to apply the parallax to
			repeat: false,
			loopScroll: '',
			loopScrollTime: '2',
			removeOrig: false,
			id: '',
			complete: function() {}
	};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend( {}, defaults, options );

		if ( this.settings.align == '' ) {
			this.settings.align = 'center';
		}
		
		if ( this.settings.id === '' ) {
			this.settings.id = +new Date();
		}

		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function () {
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like so: this.yourOtherFunction(this.element, this.settings).
			// console.log("xD");

			// $(window).bind( 'parallax', function() {
			// self.gambitImageParallax();
			// });

			// If there is no target, use the element as the target
			if ( this.settings.target === '' ) {
				this.settings.target = $(this.element);
			}
			
			this.settings.target.addClass( this.settings.direction );

			// If there is no image given, use the background image if there is one
			if ( this.settings.image === '' ) {
				//if ( typeof $(this.element).css('backgroundImage') !== 'undefined' && $(this.element).css('backgroundImage').toLowerCase() !== 'none' && $(this.element).css('backgroundImage') !== '' )
				if ( typeof $(this.element).css('backgroundImage') !== 'undefined' && $(this.element).css('backgroundImage') !== '' ) {
					this.settings.image = $(this.element).css('backgroundImage').replace( /url\(|\)|"|'/g, '' );
				}
			}

			_gambitImageParallaxImages.push( this );

			this.setup();

			this.settings.complete();
			
			this.containerWidth = 0;
			this.containerHeight = 0;
		},


		setup: function () {
			if ( this.settings.removeOrig !== false ) {
				$(this.element).remove();
			}

			this.resizeParallaxBackground();
		},


		doParallax: function () {

			// if it's a mobile device and not told to activate on mobile, stop.
			if ( this.settings.mobiledevice && ! this.settings.mobileenabled ) {
				return;
			}

			// fixed backgrounds need no movement
			if ( this.settings.direction === 'fixed' ) {
				
				// Chrome retina bug where the background doesn't repaint
				// Bug report: https://code.websharpstudios.com/p/chromium/issues/detail?id=366012
				if ( window.devicePixelRatio > 1 ) {
					$(this.settings.target).hide().show(0);
					//this.settings.target[0].style.display = 'none';
					//this.settings.target[0].style.display = '';
				}
				
			}

			// check if the container is in the view
			if ( ! this.isInView() ) {
				return;
			}

			// Continue moving the background
			if ( typeof this.settings.inner === 'undefined' ) {
				// this.settings.inner = this.settings.target.find('.parallax-inner-' + this.settings.id);
				this.settings.inner = this.settings.target[0].querySelectorAll('.parallax-inner-' + this.settings.id)[0];
			}
			var $target = this.settings.inner;
			
			
			// Retrigger a resize if the container's size suddenly changed
			// var w = this.settings.target.width() + parseInt( this.settings.target.css( 'paddingRight' ) ) + parseInt( this.settings.target.css( 'paddingLeft' ) );
			// var h = this.settings.target.height() + parseInt( this.settings.target.css( 'paddingTop' ) ) + parseInt( this.settings.target.css( 'paddingBottom' ) );

			if ( typeof this.settings.doParallaxClientLastUpdate === 'undefined' 
				|| +new Date() - this.settings.doParallaxClientLastUpdate > 2000 + Math.random() * 1000 ) {
				this.settings.doParallaxClientLastUpdate = +new Date();

				this.settings.clientWidthCache = this.settings.target[0].clientWidth;
				this.settings.clientHeightCache = this.settings.target[0].clientHeight;
			}
			
			if ( this.containerWidth !== 0 
				&& this.containerHeight !== 0 
				&& ( this.settings.clientWidthCache !== this.containerWidth 
					|| this.settings.clientHeightCache !== this.containerHeight ) ) {
				this.resizeParallaxBackground();
			}
			this.containerWidth = this.settings.clientWidthCache;
			this.containerHeight = this.settings.clientHeightCache;

			// If we don't have anything to scroll, stop
			// if ( typeof $target === 'undefined' || $target.length === 0 ) {
			// 	return;
			// }

			// compute for the parallax amount
			var percentageScroll = (_gambitScrollTop - this.scrollTopMin) / (this.scrollTopMax - this.scrollTopMin);
			var dist = this.moveMax * percentageScroll;

			// change direction
			if ( this.settings.direction === 'left' || this.settings.direction === 'up' ) {
				dist *= -1;
			}

			// IE9 check, IE9 doesn't support 3d transforms, so fallback to 2d translate
			var translateHori = 'translate3d(';
			var translateHoriSuffix = 'px, 0px, 0px)';
			var translateVert = 'translate3d(0px, ';
			var translateVertSuffix = 'px, 0px)';
			if ( typeof _gambitParallaxIE9 !== 'undefined' ) {
				translateHori = 'translate(';
				translateHoriSuffix = 'px, 0px)';
				translateVert = 'translate(0px, ';
				translateVertSuffix = 'px)';
			}


			if ( $target.style.backgroundRepeat === "no-repeat" ) {
				if ( this.settings.direction === 'down' && dist < 0 ) {
					dist = 0;
				}
				if ( this.settings.direction === 'up' && dist > 0 ) {
					dist = 0;
				}
			}

			// Apply the parallax transforms
			if ( this.settings.direction === 'left' || this.settings.direction === 'right' ) {
				$target.style.transition = 'transform 1ms linear';
				$target.style.webkitTransform = translateHori + dist + translateHoriSuffix;
				$target.style.transform = translateHori + dist + translateHoriSuffix;
			}
			else {
				$target.style.transition = 'transform 1ms linear';
				$target.style.webkitTransform = translateVert + dist + translateVertSuffix;
				$target.style.transform = translateVert + dist + translateVertSuffix;
			}
		
			// In some browsers, parallax might get jumpy/shakey, this hack makes it better
			// by force-cancelling the transition duration
			$target.style.transition = 'transform -1ms linear';
		},


		// Checks whether the container with the parallax is inside our viewport
		isInView: function() {

			// if ( typeof $target === 'undefined' || $target.length === 0 ) {
			// 	return;
			// }

			// Cache some values for faster calculations
			if ( typeof this.settings.offsetLastUpdate === 'undefined' 
				|| +new Date() - this.settings.offsetLastUpdate > 4000 + Math.random() * 1000 ) {
					
				this.settings.offsetLastUpdate = +new Date();

				var $target = this.settings.target[0];
				
				// this.settings.offsetTopCache = $target.offset().top;
				// this.settings.elemHeightCache = $target.height()
				// 	+ parseInt( $target.css('paddingTop') )
				// 	+ parseInt( $target.css('paddingBottom') );
				this.settings.offsetTopCache = $target.getBoundingClientRect().top + window.pageYOffset;
				this.settings.elemHeightCache = $target.clientHeight;
			}
			
			var elemTop = this.settings.offsetTopCache;
			var elemHeight = this.settings.elemHeightCache;

			if ( elemTop + elemHeight < _gambitScrollTop || _gambitScrollTop + _gambitWindowHeight < elemTop ) {
				return false;
			}

			return true;
		},
		
		
		computeCoverDimensions: function( imageWidth, imageHeight, container ) {
			/* Step 1 - Get the ratio of the div + the image */
	        var imageRatio = imageWidth / imageHeight;
	        var coverRatio = container.offsetWidth / container.offsetHeight;

	        /* Step 2 - Work out which ratio is greater */
	        if ( imageRatio >= coverRatio ) {
	            /* The Height is our constant */
	            var finalHeight = container.offsetHeight;
	            var scale = ( finalHeight / imageHeight );
				var finalWidth = imageWidth * scale;
	        } else {
	            /* The Width is our constant */
	            var finalWidth = container.offsetWidth;
	            var scale = ( finalWidth / imageWidth );
				var finalHeight = imageHeight * scale;
	        }
			
			return finalWidth + 'px ' + finalHeight + 'px';
		},


		// Resizes the parallax to match the container size
		resizeParallaxBackground: function() {

			var $target = this.settings.target;
			if ( typeof $target === 'undefined' || $target.length === 0 ) {
				return;
			}


			// Repeat the background
			var isRepeat = this.settings.repeat === 'true' || this.settings.repeat === true || this.settings.repeat === 1;

			// Assert a minimum of 150 pixels of height globally. Prevents the illusion of parallaxes not rendering at all in empty fields.
			$target[0].style.minHeight = '150px';
			

			/*
			 * None, do not apply any parallax at all.
			 */

			if ( this.settings.direction === 'none' ) {

				// Stretch the image to fit the entire window
				var w = $target.width() + parseInt( $target.css( 'paddingRight' ) ) + parseInt( $target.css( 'paddingLeft' ) );

				// Compute position
				var position = $target.offset().left;
				if ( this.settings.align === 'center' ) {
					position = '50% 50%';
				}
				else if ( this.settings.align === 'left' ) {
					position = '0% 50%';
				}
				else if ( this.settings.align === 'right' ) {
					position = '100% 50%';
				}
				else if ( this.settings.align === 'top' ) {
					position = '50% 0%';
				}
				else if ( this.settings.align === 'bottom' ) {
					position = '50% 100%';
				}

				$target.css({
					opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
					backgroundSize: 'cover',
					backgroundAttachment: 'scroll',
					backgroundPosition: position,
					backgroundRepeat: 'no-repeat'
				});
				if ( this.settings.image !== '' && this.settings.image !== 'none' ) {
					$target.css({
						opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
						backgroundImage: 'url(' + this.settings.image + ')'
					});
				}

			/*
			 * Fixed, just stretch to fill up the entire container
			 */


			} else if ( this.settings.direction === 'fixed' ) {
				

				// Stretch the image to fit the entire window
				var w = $target.width() + parseInt( $target.css( 'paddingRight' ) ) + parseInt( $target.css( 'paddingLeft' ) );
				var h = $target.height() + parseInt( $target.css( 'paddingTop' ) ) + parseInt( $target.css( 'paddingBottom' ) );
				var origW = w;
				w += 400 * Math.abs( parseFloat( this.settings.velocity ) );

				// Compute left position
				var top = '0%';
				if ( this.settings.align === 'center' ) {
					top = '50%';
				} else if ( this.settings.align === 'bottom' ) {
					top = '100%';
				}

				// Compute top position
				var left = 0;
				if ( this.settings.direction === 'right' ) {
					left -= w - origW;
				}

				if ( $target.find('.parallax-inner-' + this.settings.id).length < 1 ) {
					$('<div></div>')
						.addClass('gambit_parallax_inner')
						.addClass('parallax-inner-' + this.settings.id)
						.addClass( this.settings.direction )
						.prependTo( $target );
				}
				
				// Apply the required styles
				$target.css({
					position: 'relative',
					overflow: 'hidden',
					zIndex: 1
				})
				// .attr('style', 'background-image: none !important; ' + $target.attr('style'))
				.find('.parallax-inner-' + this.settings.id ).css({
					pointerEvents: 'none',
					width: w,
					height: h,
					position: 'absolute',
					zIndex: -1,
					top: 0,
					left: left,
					opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
					// backgroundSize: isRepeat ? '100%' : 'cover',
					backgroundSize: isRepeat ? '100%' : this.computeCoverDimensions( this.settings.width, this.settings.height, $target[0].querySelectorAll('.parallax-inner-' + this.settings.id)[0] ),
					backgroundPosition: isRepeat ? '0 0 ' : '50% ' + top,
					backgroundRepeat: isRepeat ? 'repeat' : 'no-repeat',
					backgroundAttachment: 'fixed'
				});

				if ( this.settings.image !== '' && this.settings.image !== 'none' ) {
					$target.find('.parallax-inner-' + this.settings.id ).css({
						opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
						backgroundImage: 'url(' + this.settings.image + ')'
					});
				}
				


			/*
			 * Left & right parallax - Stretch the image to fit the height & extend the sides
			 */


			} else if ( this.settings.direction === 'left' || this.settings.direction === 'right' ) {

				// Stretch the image to fit the entire window
				var w = $target.width() + parseInt( $target.css( 'paddingRight' ) ) + parseInt( $target.css( 'paddingLeft' ) );
				var h = $target.height() + parseInt( $target.css( 'paddingTop' ) ) + parseInt( $target.css( 'paddingBottom' ) );
				var origW = w;
				w += 400 * Math.abs( parseFloat( this.settings.velocity ) );

				// Compute left position
				var top = '0%';
				if ( this.settings.align === 'center' ) {
					top = '50%';
				} else if ( this.settings.align === 'bottom' ) {
					top = '100%';
				}

				// Compute top position
				var left = 0;
				if ( this.settings.direction === 'right' ) {
					left -= w - origW;
				}

				if ( $target.find('.parallax-inner-' + this.settings.id).length < 1 ) {
					$('<div></div>')
						.addClass('gambit_parallax_inner')
						.addClass('parallax-inner-' + this.settings.id)
						.addClass( this.settings.direction )
						.prependTo( $target );
				}
				
				// Apply the required styles
				$target.css({
					position: 'relative',
					overflow: 'hidden',
					zIndex: 1
				})
				// .attr('style', 'background-image: none !important; ' + $target.attr('style'))
				.find('.parallax-inner-' + this.settings.id ).css({
					pointerEvents: 'none',
					width: w,
					height: h,
					position: 'absolute',
					zIndex: -1,
					top: 0,
					left: left,
					opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
					// backgroundSize: isRepeat ? '100%' : 'cover',
					backgroundSize: isRepeat ? '100%' : this.computeCoverDimensions( this.settings.width, this.settings.height, $target[0].querySelectorAll('.parallax-inner-' + this.settings.id)[0] ),
					backgroundPosition: isRepeat ? '0 0 ' : '50% ' + top,
					backgroundRepeat: isRepeat ? 'repeat' : 'no-repeat'
				});
				

				if ( this.settings.image !== '' && this.settings.image !== 'none' ) {
					$target.find('.parallax-inner-' + this.settings.id ).css({
						opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
						backgroundImage: 'url(' + this.settings.image + ')'
					});
				}

				// Compute for the positions to save cycles
				var scrollTopMin = 0;
				if ( $target.offset().top > _gambitWindowHeight ) {
					scrollTopMin = $target.offset().top - _gambitWindowHeight;
				}
				var scrollTopMax = $target.offset().top + $target.height() + parseInt( $target.css( 'paddingTop' ) ) + parseInt( $target.css( 'paddingBottom' ) );

				this.moveMax = w - origW;
				this.scrollTopMin = scrollTopMin;
				this.scrollTopMax = scrollTopMax;


			/*
			 * Up & down parallax - Stretch the image to fit the width & extend vertically
			 */


			} else { // Up or down
				// We have to add a bit more to DOWN since the page is scrolling as well,
				// or else it will not be visible
				var heightCompensate = 800;
				if ( this.settings.direction === 'down' ) {
					heightCompensate *= 1.2;
				}

				// Stretch the image to fit the entire window
				var w = $target.width() + parseInt( $target.css( 'paddingRight' ) ) + parseInt( $target.css( 'paddingLeft' ) );
				var h = $target.height() + parseInt( $target.css( 'paddingTop' ) ) + parseInt( $target.css( 'paddingBottom' ) );
				var origH = h;
				h += heightCompensate * Math.abs( parseFloat(this.settings.velocity) );

				// Compute left position
				var left = '0%';
				if ( this.settings.align === 'center' ) {
					left = '50%';
				} else if ( this.settings.align === 'right' ) {
					left = '100%';
				}

				// Compute top position
				var top = 0;
				if ( this.settings.direction === 'down' ) {
					top -= h - origH;
				}

				if ( $target.find('.parallax-inner-' + this.settings.id).length < 1 ) {
					$('<div></div>')
						.addClass('gambit_parallax_inner')
						.addClass('parallax-inner-' + this.settings.id)
						.addClass( this.settings.direction )
						.prependTo( $target );
				}

				// Apply the required styles
				$target.css({
					position: 'relative',
					overflow: 'hidden',
					zIndex: 1
				})
				// .attr('style', 'background-image: none !important; ' + $target.attr('style'))
				.find('.parallax-inner-' + this.settings.id).css({
					pointerEvents: 'none',
					width: w,
					height: h,
					position: 'absolute',
					zIndex: -1,
					top: top,
					left: 0,
					opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
					// backgroundSize: isRepeat ? '100%' : 'cover',
					backgroundSize: isRepeat ? '100%' : this.computeCoverDimensions( this.settings.width, this.settings.height, $target[0].querySelectorAll('.parallax-inner-' + this.settings.id)[0] ),
					backgroundPosition: isRepeat ? '0' : left + ' 50%',
					backgroundRepeat: isRepeat ? 'repeat' : 'no-repeat'
				});

				if ( this.settings.image !== '' && this.settings.image !== 'none' ) {
					$target.find('.parallax-inner-' + this.settings.id).css({
						opacity: Math.abs( parseFloat ( this.settings.opacity ) / 100 ),
						backgroundImage: 'url(' + this.settings.image + ')'
					});
				}

				// Compute for the positions to save cycles
				var scrollTopMin = 0;
				if ( $target.offset().top > _gambitWindowHeight ) {
					scrollTopMin = $target.offset().top - _gambitWindowHeight;
				}
				var scrollTopMax = $target.offset().top + $target.height() + parseInt( $target.css( 'paddingTop' ) ) + parseInt( $target.css( 'paddingBottom' ) );

				this.moveMax = h - origH;
				this.scrollTopMin = scrollTopMin;
				this.scrollTopMax = scrollTopMax;
			}
		},
		
	});


	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		// chain jQuery functions
		return this;
	};


})( jQuery, window, document );



function _gambitRefreshScroll() {
	var $ = jQuery;
	_gambitScrollTop = window.pageYOffset;//$(window).scrollTop();
	_gambitScrollLeft = window.pageXOffset;//$(window).scrollLeft();
}

function _gambitParallaxAll() {
	_gambitRefreshScroll();
	for ( var i = 0; i < _gambitImageParallaxImages.length; i++) {
		_gambitImageParallaxImages[ i ].doParallax();
	}
}

jQuery(document).ready(function($) {
	"use strict";

	$( window ).on(
		'scroll touchmove touchstart touchend gesturechange mousemove', function( e ) {
			requestAnimationFrame( _gambitParallaxAll );
		}
	);

	function mobileParallaxAll() {
		_gambitRefreshScroll();
		for ( var i = 0; i < _gambitImageParallaxImages.length; i++) {
			_gambitImageParallaxImages[ i ].doParallax();
		}
		requestAnimationFrame(mobileParallaxAll);
	}


	if ( navigator.userAgent.match(/Mobi/)) {
		requestAnimationFrame(mobileParallaxAll);
	}


	// When the browser resizes, fix parallax size
	// Some browsers do not work if this is not performed after 1ms
	$(window).on( 'resize', function() {
		setTimeout( function() {
			var $ = jQuery;
			_gambitRefreshWindow();
			$.each( _gambitImageParallaxImages, function( i, parallax ) {
				parallax.resizeParallaxBackground();
			} );
		}, 1 );
	} );

	// setTimeout( parallaxAll, 1 );
	setTimeout( function() {
		var $ = jQuery;
		_gambitRefreshWindow();
		$.each( _gambitImageParallaxImages, function( i, parallax ) {
			parallax.resizeParallaxBackground();
		} );
	}, 1 );

	// setTimeout( parallaxAll, 100 );
	setTimeout( function() {
		var $ = jQuery;
		_gambitRefreshWindow();
		$.each( _gambitImageParallaxImages, function( i, parallax ) {
			parallax.resizeParallaxBackground();
		} );
	}, 100 );

	function _gambitRefreshWindow() {
		_gambitScrollTop = window.pageYOffset;//$(window).scrollTop();
		_gambitWindowHeight = window.innerHeight;//$(window).height()
		_gambitScrollLeft = window.pageXOffset;//$(window).scrollLeft();
		_gambitWindowWidth = window.innerWidth;//$(window).width()
	}
});






/**
 * These are in charge of initializing YouTube
 */


function _vcRowGetAllElementsWithAttribute( attribute ) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute)) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}


function _vcRowOnPlayerReady(event) {
    var player = event.target;
    player.playVideo();
	
    if ( player.isMute ) {
        player.mute();
    }
	
	if ( player.forceHD ) {
		player.setPlaybackQuality( 'hd720' );
	}
	
	var prevCurrTime = player.getCurrentTime();
	var timeLastCall = +new Date() / 1000;
	var currTime = 0;
	var firstRun = true;

    player.loopInterval = setInterval(function() {
        if ( typeof player.loopTimeout !== 'undefined' ) {
            clearTimeout( player.loopTimeout );
        }

		if ( prevCurrTime == player.getCurrentTime() ) {
			currTime = prevCurrTime + ( +new Date() / 1000 - timeLastCall );
		} else {
			currTime = player.getCurrentTime();
			timeLastCall = +new Date() / 1000;
		}
		prevCurrTime = player.getCurrentTime();
		
		if ( currTime + ( firstRun ? 0.45 : 0.21 ) >= player.getDuration() ) {
			player.pauseVideo();
			player.seekTo(0);
			player.playVideo();
			firstRun = false;
		}
    }, 150);
}

function _vcRowOnPlayerStateChange(event) {
    if ( event.data === YT.PlayerState.ENDED ) {
        if ( typeof event.target.loopTimeout !== 'undefined' ) {
            clearTimeout( event.target.loopTimeout );
        }
        event.target.seekTo(0);

	// Make the video visible when we start playing
    } else if ( event.data === YT.PlayerState.PLAYING ) {
		jQuery(event.target.getIframe()).parent().css('visibility', 'visible');
    }
}

function resizeVideo( $wrapper ) {
    var $videoContainer = $wrapper.parent();

    if ( $videoContainer.find('iframe').width() === null ) {
        setTimeout( function() {
            resizeVideo( $wrapper );
        }, 500);
        return;
    }

    var $videoWrapper = $wrapper;

    $videoWrapper.css({
        width: 'auto',
        height: 'auto',
        left: 'auto',
        top: 'auto'
    });

    $videoWrapper.css('position', 'absolute');

    var vidWidth = $videoContainer.find('iframe').width();
    var vidHeight = $videoContainer.find('iframe').height();
    var containerWidth = $videoContainer.width();
    var containerHeight = $videoContainer.height();

	var finalWidth;
	var finalHeight;
	var deltaWidth;
	var deltaHeight;

	var aspectRatio = '16:9';
	if ( typeof $wrapper.attr('data-video-aspect-ratio') !== 'undefined' ) {
		if ( $wrapper.attr('data-video-aspect-ratio').indexOf(':') !== -1 ) {
			aspectRatio = $wrapper.attr('data-video-aspect-ratio').split(':');
			aspectRatio[0] = parseFloat( aspectRatio[0] );
			aspectRatio[1] = parseFloat( aspectRatio[1] );
		}
	}

	finalHeight = containerHeight;
	finalWidth = aspectRatio[0] / aspectRatio[1] * containerHeight;

	deltaWidth = ( aspectRatio[0] / aspectRatio[1] * containerHeight ) - containerWidth;
	deltaHeight = ( containerWidth * aspectRatio[1] ) / aspectRatio[0] - containerHeight;

	if ( finalWidth >= containerWidth && finalHeight >= containerHeight ) {
		height = containerHeight;
		width = aspectRatio[0] / aspectRatio[1] * containerHeight
	} else {
		width = containerWidth;
		height = ( containerWidth * aspectRatio[1] ) / aspectRatio[0];
	}

	marginTop = - ( height - containerHeight ) / 2;
	marginLeft = - ( width - containerWidth ) / 2;

    $videoContainer.find('iframe').css({
        'width': width,
        'height': height,
        'marginLeft': marginLeft,
        'marginTop': marginTop
    })
	.attr('width', width)
	.attr('height', height);
}



var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    var videos = _vcRowGetAllElementsWithAttribute('data-youtube-video-id');

    for ( var i = 0; i < videos.length; i++ ) {
        var videoID = videos[i].getAttribute('data-youtube-video-id');

		// Get the elementID for the placeholder where we'll put in the video
        var elemID = '';
		for ( var k = 0; k < videos[i].childNodes.length; k++ ) {
			if ( /div/i.test(videos[i].childNodes[ k ].tagName ) ) {
				elemID = videos[i].childNodes[ k ].getAttribute('id');
				break;
			}
		}
		if ( elemID === '' ) {
			continue;
		}

        var mute = videos[i].getAttribute('data-mute');

        var player = new YT.Player(elemID, {
            height: 'auto',
            width: 'auto',
            videoId: videoID,
            playerVars: {
                autohide: 1,
                autoplay: 1,
                fs: 0,
                showinfo: 0,
                loop: 1,
                modestBranding: 1,
                start: 0,
                controls: 0,
                rel: 0,
                disablekb: 1,
                iv_load_policy: 3,
				wmode: 'transparent'
            },
            events: {
                'onReady': _vcRowOnPlayerReady,
                'onStateChange': _vcRowOnPlayerStateChange,
            }
        });
		
        player.isMute = mute === 'true';
		player.forceHD = videos[i].getAttribute('data-force-hd') === 'true';
		
		// Videos in Windows 7 IE do not fire onStateChange events so the videos do not play.
		// This is a fallback to make those work
		setTimeout( function() {
			jQuery('#' + elemID).css('visibility', 'visible');
		}, 500 );
		
    }
}



/**
 * Set up both YouTube and Vimeo videos
 */


jQuery(document).ready(function($) {

	/*
	 * Disable showing/rendering the parallax in the VC's frontend editor
	 */
	if ( $('body').hasClass('vc_editor') ) {
		return;
	}
	
	// Disable backgrounds in mobile devices
	if ( navigator.userAgent.match(/Mobi/) ) {
		$('.gambit_video_row').attr('style', 'display: none !important');
		return;
	}
	
	$('.gambit_video_row').each(function() {
		// Find the parent row
		var row = $( document.gambitFindElementParentRow( $(this)[0] ) );

		var videoContainer = $('<div></div>')
			.addClass('gambit_video_inner')
			// .addClass('parallax-inner-' + this.settings.id)
			.css('opacity', Math.abs( parseFloat ( $(this).attr('data-opacity') ) / 100 ));
			
		row.css('position', 'relative');
		
		$(this).children().prependTo( videoContainer );
		videoContainer.prependTo( row );
	});


    $('[data-youtube-video-id], [data-vimeo-video-id]').each(function() {
        var $this = $(this);
        setTimeout( function() {
            resizeVideo( $this );
        }, 100);
    });

    $(window).resize(function() {
        $('[data-youtube-video-id], [data-vimeo-video-id]').each(function() {
            var $this = $(this);
            setTimeout( function() {
                resizeVideo( $this );
            }, 2);
        });
    });

	// Hide Vimeo player, show it when we start playing the video
	$('[data-vimeo-video-id]').each(function() {
		var player = $f($(this).find('iframe')[0]);
		var $this = $(this);

	    player.addEvent('ready', function() {

			// mute
			if ( $this.attr('data-mute') === 'true' ) {
				player.api( 'setVolume', 0 );
			}

			// show the video after the player is loaded
			player.addEvent('playProgress', function(data, id) {
				jQuery('#' + id).parent().css('visibility', 'visible');
			});
	    });
	});

    // When the player is ready, add listeners for pause, finish, and playProgress
	
});

document.addEventListener('DOMContentLoaded', function() {
	var elements = document.querySelectorAll('.gambit_hover_row');

	// Set up the hover div
	Array.prototype.forEach.call(elements, function(el, i) {
		// find Row
		var row = document.gambitFindElementParentRow( el );
		
		row.style.overflow = 'hidden';
		row.classList.add('has_gambit_hover_row');
		
		// Add a new div
		var div = document.createElement('div');
		div.classList.add('gambit_hover_inner');
		div.setAttribute('data-type', el.getAttribute('data-type'));
		div.setAttribute('data-amount', el.getAttribute('data-amount'));
		div.setAttribute('data-inverted', el.getAttribute('data-inverted'));
		div.style.opacity = Math.abs( parseFloat ( el.getAttribute('data-opacity') ) / 100 );
		div.style.backgroundImage = 'url(' + el.getAttribute('data-bg-image') + ')';
		
		var offset = 0;
		if ( el.getAttribute('data-type') === 'tilt' ) {
			offset = - parseInt( el.getAttribute('data-amount') ) * .6 + '%';
		} else {
			offset = - parseInt( el.getAttribute('data-amount') ) + 'px';
		}
		div.style.top = offset;
		div.style.left = offset;
		div.style.right = offset;
		div.style.bottom = offset;
		
		row.insertBefore(div, row.firstChild);
		
	});
	
	
	// Disable hover rows in mobile
	if ( navigator.userAgent.match(/Mobi/) ) {
		return;
	}
	
	
	// Bind to mousemove so animate the hover row
	var elements = document.querySelectorAll('.has_gambit_hover_row');
	Array.prototype.forEach.call(elements, function(row, i) {
		
		row.addEventListener('mousemove', function(e) {
			
			// Get the parent row
			var parentRow = e.target.parentNode;
			while ( ! parentRow.classList.contains('has_gambit_hover_row') ) {
						
				if ( parentRow.tagName === 'HTML' ) {
					return;
				}
				
				parentRow = parentRow.parentNode;
			}
			
			// Get the % location of the mouse position inside the row
			var rect = parentRow.getBoundingClientRect();
			var top = e.pageY - ( rect.top + window.pageYOffset );
			var left = e.pageX  - ( rect.left + window.pageXOffset );
			top /= parentRow.clientHeight;
			left /= parentRow.clientWidth;
			
			// Move all the hover inner divs
			var hoverRows = parentRow.querySelectorAll('.gambit_hover_inner');
			Array.prototype.forEach.call(hoverRows, function(hoverBg, i) {
			
				// Parameters
				var amount = parseFloat( hoverBg.getAttribute( 'data-amount' ) );
				var inverted = hoverBg.getAttribute( 'data-inverted' ) === 'true';
				var transform;
			
				if ( hoverBg.getAttribute( 'data-type' ) === 'tilt' ) {
					
					var rotateY = left * amount - amount / 2;
					var rotateX = ( 1 - top ) * amount - amount / 2;
					if ( inverted ) {
						rotateY = ( 1 - left ) * amount - amount / 2;
						rotateX = top * amount - amount / 2;
					}
					
					transform = 'perspective(2000px) ';
					transform += 'rotateY(' + rotateY + 'deg) ';
					transform += 'rotateX(' + rotateX + 'deg) ';

					hoverBg.style.transition = 'all 0s';
					hoverBg.style.webkitTransform = transform;
					hoverBg.style.transform = transform;
					
				} else {
				
					var moveX = left * amount - amount / 2;
					var moveY = top * amount - amount / 2;
					if ( inverted ) {
						moveX *= -1;
						moveY *= -1;
					}
					transform = 'translate3D(' + moveX + 'px, ' + moveY + 'px, 0) ';

					hoverBg.style.transition = 'all 0s';
					hoverBg.style.webkitTransform = transform;
					hoverBg.style.transform = transform;
				}
				
			});
		});
		
	
		// Bind to mousemove so animate the hover row to it's default state
		row.addEventListener('mouseout', function(e) {
			
			// Get the parent row
			var parentRow = e.target.parentNode;
			while ( ! parentRow.classList.contains('has_gambit_hover_row') ) {
						
				if ( parentRow.tagName === 'HTML' ) {
					return;
				}
				
				parentRow = parentRow.parentNode;
			}
			
			// Reset all the animations
			var hoverRows = parentRow.querySelectorAll('.gambit_hover_inner');
			Array.prototype.forEach.call(hoverRows, function(hoverBg, i) {

				var amount = parseFloat( hoverBg.getAttribute( 'data-amount' ) );
			
				hoverBg.style.transition = 'all 3s ease-in-out';
				if ( hoverBg.getAttribute( 'data-type' ) === 'tilt' ) {
					hoverBg.style.webkitTransform = 'perspective(2000px) rotateY(0) rotateX(0)';
					hoverBg.style.transform = 'perspective(2000px) rotateY(0) rotateX(0)';
				} else {
					hoverBg.style.webkitTransform = 'translate3D(0, 0, 0)';
					hoverBg.style.transform = 'translate3D(0, 0, 0)';
				}
				
			});
		});
	});
	
});

document.addEventListener('DOMContentLoaded', function() {

	var elements = document.querySelectorAll('.gambit_background_row');

	// Set up the hover div
	Array.prototype.forEach.call(elements, function(el, i) {
		var row = document.gambitFindElementParentRow( el );

		var styles = getComputedStyle( el );
		row.style.backgroundImage = styles.backgroundImage;
		row.style.backgroundColor = styles.backgroundColor;
		row.style.backgroundRepeat = styles.backgroundRepeat;
		row.style.backgroundSize = styles.backgroundSize;
		row.style.backgroundPosition = styles.backgroundPosition;
		
	});
	
});

