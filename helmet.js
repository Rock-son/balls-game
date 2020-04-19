"use strict";

const helmet = require("helmet");

module.exports = function a(app) {
	app.use(helmet.hidePoweredBy({
		setTo: 'PHP 7.2.0'
	}));
	app.use(helmet.contentSecurityPolicy({
		directives: {
			"defaultSrc": 	[ "'self'" ],
			"scriptSrc": 	[ "'self'", "'unsafe-eval'", "https://polyfill.io", "https://code.jquery.com"],
			"styleSrc": 	[ "'self'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com" ],
			"fontSrc": 		[ "'self'" , "https://fonts.gstatic.com" ],
			"imgSrc":	    [ "'self'", "data:" ],			
			"objectSrc": 	[ "'none'"],
			"sandbox":		[ "allow-forms", "allow-scripts", "allow-same-origin" ],
			"reportUri": 	'/report-violation',
			"upgradeInsecureRequests": true
		},
		// set up a POST route for notifying / logging data to server
		// "reportOnly=true" - policy will not be enforced
		reportOnly: process.env.NODE_ENV !== "production",
		// This module will detect common mistakes in your directives and throw errors
		// if it finds any. To disable this, enable "loose mode".
		loose: true,
		// Set to true if you want to blindly set all headers: Content-Security-Policy,
		// X-WebKit-CSP, and X-Content-Security-Policy.
		setAllHeaders: false,

		// Set to true if you want to disable CSP on Android where it can be buggy.
		disableAndroid: true,
	}));



	app.use((req, res, next) => {
		res.set({
			"Access-Control-Allow-Origin": "<origin>",
			"Vary": "Origin"
		});
		next();
	});

};