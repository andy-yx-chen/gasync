Gasync
=========

A library to easy you from writing callback functions with generators

## Installation

  npm install gasync --save

## Usage

var http = require('http');
var Async = require('gasync');
var HttpResponse = function(res){
	this.response = res;
	this.message = '';
};
HttpResponse.prototype = {
	read:function(callback){
		this.callback = callback;
		this.response.on('data', this._data.bind(this));
		this.response.on('end', this._done.bind(this));
	},
	_data:function(message){
		this.message += message;
	},
	_done:function(){
		this.callback(this.message);
	}
};
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
	var chunk = yield new HttpResponse(res).read(async.callback());
	console.log(chunk[0]);
})
.then(new Async(function *(async){
	var options = {
		host: 'www.bing.com',
		port: 80,
		path: '/',
		method: 'GET'
	};
	var response = yield http.request(options, async.callback()).end();
	var res = response[0];
	console.log('Status: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	var chunk = yield new HttpResponse(res).read(async.callback());
	console.log(chunk[0]);
}))
.then(new Async(function *(async){
	var options = {
		host: 'www.andytech.net',
		port: 80,
		path: '/index.html',
		method: 'GET'
	};
	var response = yield http.request(options, async.callback()).end();
	var res = response[0];
	console.log('Status: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	var chunk = yield new HttpResponse(res).read(async.callback());
	console.log(chunk[0]);
}))
.run();

