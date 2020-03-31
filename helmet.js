"use strict";

const helmet = require("helmet");

module.exports = function a(app) {
	app.use(helmet.hidePoweredBy({
		setTo: 'PHP 7.2.0'
	}));
	app.use(helmet.contentSecurityPolicy({
		directives: {
			"default-src": 	[ "'self'" ],
			"script-src": 	[ "'self'" ],
			"style-src": 	[ "'self'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com" ],
			"font-src": 	[ "'self'" , "https://fonts.gstatic.com" ],
			"img-src":	    [ "'self'", "data:" ],			
			"object-src": ["'none'"],
			"sandbox":	[ "allow-forms", "allow-scripts", "allow-same-origin" ],
			"report-uri": '/report-violation',
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