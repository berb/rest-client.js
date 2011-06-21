(function() {

	var restClient = {};
	var main = this; // global (node.js) || window (browser)

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = restClient;
	}
	else {
		main.restClient = restClient;
	}

	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun /*, thisp */) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var thisp = arguments[1];
			for ( var i = 0; i < len; i++) {
				if (i in t)
					fun.call(thisp, t[i], i, t);
			}
		};
	}

	if (!Array.prototype.filter) {
		Array.prototype.filter = function(fun /*, thisp */) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var res = [];
			var thisp = arguments[1];
			for ( var i = 0; i < len; i++) {
				if (i in t) {
					var val = t[i];
					if (fun.call(thisp, val, i, t))
						res.push(val);
				}
			}
			return res;
		};
	}
	
	//Headers not allowed (at least when using XHR)
	var forbiddenRequestHeaders = [ "Accept-Charset", "Accept-Encoding", "Connection", "Content-Length", "Cookie", "Cookie2", "Content-Transfer-Encoding", "Date", "Expect", "Host", "Keep-Alive", "Referer", "TE", "Trailer", "Transfer-Encoding", "Upgrade", "User-Agent", "Via" ];

	//List of possible response headers
	var possibleResponseHeaders = ["Accept-Ranges","Age","Allow","Cache-Control","Connection","Content-Encoding","Content-Language","Content-Length","Content-Location","Content-MD5","Content-Disposition","Content-Range","Content-Type","Date","ETag","Expires","Last-Modified","Link","Location","Pragma","Proxy-Authenticate","Refresh","Retry-After","Server","Trailer","Transfer-Encoding","Vary","Via","Warning","WWW-Authenticate"];

	//Removes forbidden request headers
	var filterRequestHeaders = function(headers) {
		forbiddenRequestHeaders.forEach(function(header){
			if(headers[header]){
				delete headers[header];
			}
		});		
		return headers;
	};
	
	var _request;

	if (typeof exports === "object") {
		//node    	
		var http = require('http');
		var url = require('url');
		
		_request = function(method, uri, headers, entity, callback) {

			var parsedUri = url.parse(uri);

			var options = {
				method : method,
				host : parsedUri.hostname,
				port : parsedUri.port || 80,
				path : parsedUri.pathname || "/" + (parseUri.search ? search : "") + (parseUri.hash ? hash : ""),
				headers : headers
			};

			var req = http.request(options, function(res) {
				var c = "";
				res.setEncoding('utf8');

				res.on('data', function(chunk) {
					c = c + chunk;
				});

				res.once('end', function() {
					if (c && c.length > 0) {
						try {
							var responseEntity = JSON.parse(c);
							callback(null, res.statusCode, res.headers, responseEntity);
						}
						catch (e) {
							callback(e);
						}
					}
					else {
						callback(null, res.statusCode, res.headers, null);
					}
				});
			});

			req.on('error', function(e) {
				callback(e);
				console.log(e);
			});

			if (entity) {
				req.write(entity);
			}
			req.end();
		};
	}
	else {
		//(hopefully) browser    	
		_request = function(method, uri, headers, entity, callback) {

			var xhr = null;
			try {
				xhr = new XMLHttpRequest();
			}
			catch (e) {
				try {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {
					try {
						xhr = new ActiveXObject("Msxml2.XMLHTTP");
					}
					catch (e) {
						xhr = null;
					}
				}
			}
			if (xhr) {
				xhr.open(method, uri, true);

				var header;
				for (header in headers) {
					if (headers.hasOwnProperty(header)) {
						xhr.setRequestHeader(header, headers[header]);
					}
				}

				var responseEntity = null;
				var responseHeaders = {};


				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4) {

						responseEntity = xhr.responseText;

						if (xhr.responseText && xhr.getResponseHeader('Content-Type') && xhr.getResponseHeader('Content-Type') === "application/json") {
							try {
								responseEntity = JSON.parse(xhr.responseText);
							}
							catch (e) {
								callback(e);
								return;
							}
						}

						//Workaround for browser bug
						var allHeaders = xhr.getAllResponseHeaders(); 
						if(allHeaders === null){
							possibleResponseHeaders.forEach(function(header){
								var h = xhr.getResponseHeader(header)
								if(h !== null){
									responseHeaders[header] = h;
								}
							});
						}
						else{
							allHeaders.split("\n").forEach(function(line){
								var h = line.split(": ");
								responseHeaders[h[0]] = h[1];
							});
						}

						callback(null, xhr.status, responseHeaders, responseEntity);
					}
				};
				xhr.send(entity || null);
			}
		};
	}

	var request = function(method, uri, h, ent, callback) {
		var headers = filterRequestHeaders(h || {});
		var entity = null;

		if (ent) {
			if (typeof (ent) === 'object') {
				try {
					var entity = JSON.stringify(ent);
					headers['Content-Type'] = "application/json";
				}
				catch (e) {
					callback(e);
					return;
				}
			}
		}
		_request(method, uri, headers, entity, callback);
	};

	restClient.get = function(uri, headers, callback) {
		if (typeof (headers) === 'function') {
			request("GET", uri, {}, null, headers);
		}
		else {
			request("GET", uri, headers || {}, null, callback || function() {
			});
		}
	};

	restClient.head = function(uri, headers, callback) {
		if (typeof (headers) === 'function') {
			request("HEAD", uri, {}, null, headers);
		}
		else {
			request("HEAD", uri, headers || {}, null, callback || function() {
			});
		}
	};

	restClient.post = function(uri, headers, entity, callback) {
		request("POST", uri, headers || {}, entity || null, callback || function() {
		});
	};

	restClient.put = function(uri, headers, entity, callback) {
		request("PUT", uri, headers || {}, entity || null, callback || function() {
		});
	};

	restClient.del = function(uri, headers, entity, callback) {
		request("DELETE", uri, headers || {}, entity || null, callback || function() {
		});
	};

})();