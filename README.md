Gasync
=========

A library to easy you from writing callback functions with generators

## Installation

  npm install gasync --save

## Usage

var http = require('http');
var Async = require('gasync');
new Async(function *(async){
	var options = {
		host: 'www.google.com',
		port: 80,
		path: '/',
		method: 'GET'
	};
	var response = yield http.request(options, async.callback()).end();
	var res = response[0];
	console.log('Status: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	var chunk = yield res.on('data', async.callback());
	while(typeof chunk !== 'undefined' && chunk.length == 1 && chunk[0] !== ''){
		console.log(chunk[0]);
		var chunk = yield async.more();
	}
}).run();