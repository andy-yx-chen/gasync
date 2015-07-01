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
var HttpClient = function(writer){
	this.writer = writer;
};

HttpClient.prototype = {
	get: function*(async, host, port, path){
		var options = {
			host: host,
			port: port,
			path: path,
			method: 'GET'
		};
		var response = yield http.request(options, async.callback()).end();
		var res = response[0];
		this.writer('Status: ' + res.statusCode);
		this.writer('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		var chunk = yield new HttpResponse(res).read(async.callback());
		this.writer(chunk[0]);
	}
};

var httpClient = new HttpClient(console.log);
new Async(httpClient.get).bind(httpClient, ['www.google.com', 80, '/'])
.then(new Async(httpClient.get).bind(httpClient, ['www.bing.com', 80, '/']))
.then(new Async(httpClient.get).bind(httpClient, ['www.andytech.net', 80, '/index.html']))
.run();