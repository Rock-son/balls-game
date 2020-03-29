const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const serveStatic = require('serve-static');
const favicon = require('serve-favicon');
// EXPRESS LIMITER
const RateLimiter = require("express-rate-limit");
// SECURITY
const helmet = require("./helmet.js");

const app = express();

const limiter = new RateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // limit each IP to 200 requests per windowMs (fonts, jpeg, css)
	delayMs: 0 // disable delaying - full speed until the max limit is reached
});
// SECURITY
helmet(app);

// LIMITER
app.use(limiter);

// ROUTES
app.use(serveStatic(path.join(__dirname, "ClientApp/build/")));
app.use(favicon(path.join(__dirname, 'ClientApp/public/', 'favicon.ico')));
// BODY PARSERS
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* TODO: CSP VIOLATION LOGGER */
app.post("/report-violation",
bodyParser.json({
		type: ["json", "application/json"]
	}),
	(req, res) => {
    if (req.body) {
		console.log('csp violation: ', req.body, process.env.INLINE_RUNTIME_CHUNK)
	  } else {
		console.log('csp violation: no data received!')
	  }
	  res.status(204).end()
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "ClientApp/build", "index.html")));

module.exports = app;