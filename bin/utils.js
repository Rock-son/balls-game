/* eslint-disable no-console */

"use strict";


/**
 * Helpers dependencies.
 */
const debug = require("debug")("turing-challenge:server");

/**
 * Normalize a port into a number, string, or false.
 * @param(any) - port value or string
 * @return port asvalue or named pipe
 */
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (Number.isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error, {
	port = process.env.port
}) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ?
		`Pipe ${port}` :
		`Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening({
	server = {}
}) {
	const addr = server.address();
	const bind = typeof addr === 'string' ?
		`pipe ${addr}` :
		`port ${addr.port}`;
	console.log(`Listening on ${bind}`);
	debug(`Listening on ${bind}`);
}

/**
 * @param {Object} pool - existing db connection (to be closed)
 * @param {Object} options - default valuesn => cleanup: true, exit: true, error: null
 * @param {Number} exitCode - pushed by process.on event
 */
function exitHandler(pool, options = {
	cleanup: true,
	exit: true,
	error: null
}, exitCode) {

	if (options.cleanup && pool) {
		pool.end((err) => {
			if (err) throw err;
			console.log('Pool connections successfuly closed.');
		});
	}
	if (exitCode || exitCode === 0) {
		console.log(exitCode);
	}
	if (options.error) {
		console.log("Error", options.error);
	}
	if (options.exit) {
		process.exit();
	}
}


module.exports = {
	normalizePort,
	onError,
	onListening,
	exitHandler
};