/*
 * All sites
 */
$(function() {
	// CDN auto-select-all
	$( ".cdn input" ).on( "click", function() {
		if ( typeof this.select === "function" ) {
			this.select();
		}
	});

	/*
	 * Change navigation elements for smaller screens
	 */
	(function() {

		// Move the global nav to the footer and collapse to a select menu
		var globalLinks = $( "#global-nav .links" ).tinyNav({ header: "Browse..." }),
			nav = globalLinks.next(),
			container = $( "<div class='tinynav-container'></div>" ),
			header = $( "<h3><span>More jQuery Sites</span></h3>" );

		container.append( header, nav ).insertBefore( "ul.footer-icon-links" );

		// Collapse the site navigation to a select menu
		$( "#menu-top" ).tinyNav({ header: "Navigate..." });
	})();

	// Banner ads
});





/*
 * API sites
 */
$(function() {
	$( ".entry-example" ).each(function() {
		var iframeSrc,
			src = $( this ).find( ".syntaxhighlighter" ),
			output = $( this ).find( ".code-demo" );

		if ( !src.length || !output.length ) {
			return;
		}

		// Get the original source
		iframeSrc = src.find( "td.code .line" ).map(function() {
			// Convert non-breaking spaces from highlighted code to normal spaces
			return $( this ).text().replace( /\xa0/g, " " );
		// Restore new lines from original source
		}).get().join( "\n" );

		iframeSrc = iframeSrc
			// Insert styling for the live demo that we don't want in the
			// highlighted code
			.replace( "</head>",
				"<style>" +
					"html, body { border:0; margin:0; padding:0; }" +
					"body { font-family: 'Helvetica', 'Arial',  'Verdana', 'sans-serif'; }" +
				"</style>" +
				"</head>" )
			// IE <10 executes scripts in the order in which they're loaded,
			// not the order in which they're written. So we need to defer inline
			// scripts so that scripts which need to be fetched are executed first.
			.replace( /<script>([\s\S]+)<\/script>/,
				"<script>" +
				"window.onload = function() {" +
					"$1" +
				"};" +
				"</script>" );

		var iframe = document.createElement( "iframe" );
		iframe.width = "100%";
		iframe.height = output.attr( "data-height" ) || 250;
		output.append( iframe );

		var doc = (iframe.contentWindow || iframe.contentDocument).document;
		doc.write( iframeSrc );
		doc.close();
	});
});





/*
 * jquery.org
 */
$(function() {
	$(".flexslider").flexslider({
		controlNav: "false"
	});

	/*
	 * Join page
	 */
	(function() {
		function isEmail( str ) {
			return (/^[a-zA-Z0-9.!#$%&'*+\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/).test( str );
		}

		// Enlarged gifts
		$(".enlarge").colorbox();

		// Gift forms
		var gifts = $(".choose-gifts").hide();
		$(".member-level .join").on( "click", function() {
			var gift = $( this ).nextAll(".choose-gifts").slideToggle();
			gifts.not( gift ).slideUp();
		});

		// Coupon codes
		var couponDiscount = 0;
		$( "[name='coupon']" ).each(function() {

			var input = $( this ),
				payButtons = input.closest( "form" ).find( ".pay" );

			// Hide input by default, replace with a link to show the input
			input.hide();
			$( "<a href='#'>" )
				.text( "Have a coupon code?" )
				.on( "click", function( event ) {
					event.preventDefault();
					$( this ).hide();
					input.show().focus();
				})
				.insertAfter( input );

			// TODO: loading indicator
			// Verify the coupon code on blur
			input.on( "blur", function() {
				var couponId = input.val().toLowerCase();

				// Disable pay buttons while we're verifying the coupon
				payButtons.prop( "disabled", true );

				// Verify the coupon
				$.ajax({
					url: StripeForm.url,
					dataType: "json",
					data: {
						action: "stripe_coupon",
						coupon: couponId
					}
				})
				.done(function( coupon ) {

					// Adjust payment buttons
					payButtons.each(function() {
						var amount,
							button = $( this );

						// Hide quarterly buttons
						if ( button.text().match( /Quarterly/ ) ) {
							button.hide();
						}

						// Adjust annual buttons
						if ( button.text().match( /Annual/ ) ) {
							amount = parseInt( button.data( "amount" ), 10 );
							if ( coupon.percent_off ) {
								couponDiscount = amount * (coupon.percent_off / 100);
							} else if ( coupon.amount_off ) {
								couponDiscount = coupon.amount_off;
							}

							// If the coupon is worth more than the membership,
							// don't show a negative value for the payment button
							couponDiscount = Math.min( amount, couponDiscount );
							amount = (amount - couponDiscount) / 100;
							button.text( "Annual: $" + amount );
						}
					});
				})
				.fail(function() {
					couponDiscount = 0;

					// TODO: notify user
					// Show all payment buttons with standard values
					payButtons.each(function() {
						var button = $( this ).show();

						if ( button.text().match( /Annual/ ) ) {
							amount = parseInt( button.data( "amount" ), 10 ) / 100;
							button.text( "Annual: $" + amount );
						}
					});
				})
				.always(function() {

					// Re-enable the pay buttons
					payButtons.prop( "disabled", false );
				});
			});
		});

		(function() {
			var couponCode = location.search.match(/[?&]coupon=([^&]+)/);
			if ( !couponCode ) {
				return;
			}

			couponCode = couponCode[ 1 ];
			$( "[name='coupon']" )
				.val( couponCode )
				// TODO: Move the relevant logic into a function we can call
				.each(function() {
					// Click the link to reveal the pre-filled coupon code
					$( this ).next().triggerHandler( "click" );
					// Tell the form to update based on the pre-filled coupon code
					$( this ).triggerHandler( "blur" );
				});
		})();

		function processMembership( data ) {
			return $.ajax({
				url: StripeForm.url,
				data: $.extend({
					action: StripeForm.action,
					nonce: StripeForm.nonce
				}, data )
			});
		}

		$(".member-level .pay").on( "click", function( event ) {
			event.preventDefault();
			var button = $( this ),
				form = $( this.form ),
				firstName = $.trim( form.find( "[name=first-name]" ).val() ),
				lastName = $.trim( form.find( "[name=last-name]" ).val() ),
				email = $.trim( form.find( "[name=email]" ).val() ),
				address = $.trim( form.find( "[name=address]" ).val() ),
				coupon = $.trim( form.find( "[name=coupon]" ).val().toLowerCase() ),
				amount = parseInt( button.data("amount"), 10 ) - couponDiscount,
				gifts = form.find( "select" ),
				errors = form.find( ".errors" ).empty().hide(),
				valid = true;

			function showError( msg ) {
				$( "<li>" ).text( msg ).appendTo( errors );
				valid = false;
			}

			// Verify all fields
			if ( !firstName ) {
				showError( "Please provide your first name." );
			}
			if ( !lastName ) {
				showError( "Please provide your last name." );
			}
			if ( !isEmail( email ) ) {
				showError( "Please provide a valid email address" );
			}
			if ( address.length < 10 ) {
				showError( "Please provide your full address." );
			}
			if ( gifts.filter(function() { return !$( this ).val(); }).length ) {
				showError( "Please choose a size for each gift." );
			}

			if ( !valid ) {
				errors.slideDown();
				return;
			}

			StripeCheckout.open({
				key: StripeForm.key,
				image: button.data("image"),
				name: button.data("name"),
				description: button.data("description"),
				panelLabel: ( amount > 0 ? button.data("panel-label") : "Join" ),
				amount: amount,
				token: function( stripeData ) {
					var data = {
						token: stripeData.id,
						planId: button.data( "plan-id" ),
						firstName: firstName,
						lastName: lastName,
						email: email,
						address: address,
						coupon: coupon
					};
					gifts.each(function() {
						data[ this.name ] = this.value;
					});
					processMembership( data )
						.done(function() {
							window.location = "/join/thanks/";
						}).fail(function() {
							showError(
								"There was an error processing your payment. " +
								"Please contact membership@jquery.org."
							);
							errors.slideDown();
						});
				}
			});
		});
	})();
});





/*
 * jqueryui.com
 */
$(function() {
	var demoFrame = $( ".demo-frame" ),
		demoDescription = $( ".demo-description" ),
		sourceView = $( ".view-source > div" ),
		demoList = $( ".demo-list" ),
		currentDemo = location.hash.substring( 1 );

	demoList.on( "click", "a", function( event ) {
		event.preventDefault();

		var filename = "/" + event.target.pathname.replace( /^\//, "" ),
			parts = filename.split( "/" ),
			plugin = parts[ 3 ],
			demo = parts[ 4 ].substring( 0, parts[ 4 ].length - 5 );

		$.getJSON( "/resources/demos/demo-list.json" ).then(function( demoList ) {
			demoDescription.html( $.grep( demoList[ plugin ], function( x ) {
				return x.filename === demo;
			})[ 0 ].description );
			demoFrame.attr( "src", filename );
		});

		$.get( filename.replace( "demos", "demos-highlight" ) ).then(function( content ) {
			sourceView.html( content );
		});

		demoList.find( ".active" ).removeClass( "active" );
		$( this ).parent().addClass( "active" );
		location.hash = "#" + demo;
	});

	$( ".view-source a" ).on( "click", function() {
		sourceView.animate({
			opacity: "toggle",
			height: "toggle"
		});
	});

	if ( currentDemo ) {
		demoList.find( "a" ).filter(function() {
			return this.pathname.split( "/" )[ 4 ] === (currentDemo + ".html");
		}).click();
	}
});
