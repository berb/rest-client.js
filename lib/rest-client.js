(function() {

	var restClient = {};
	var main = this; // global (node.js) || window (browser)

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = restClient;
	}
	else {
		main.restClient = restClient;
	}

	var _forEach = function(arr, iterator) {
		if (arr.forEach) {
			return arr.forEach(iterator);
		}
		for ( var i = 0; i < arr.length; i += 1) {
			iterator(arr[i], i, arr);
		}
	};

	var restrictedHeaders = [ "Accept-Charset", "Accept-Encoding", "Connection", "Content-Length", "Cookie", "Cookie2", "Content-Transfer-Encoding", "Date", "Expect", "Host", "Keep-Alive", "Referer",
			"TE", "Trailer", "Transfer-Encoding", "Upgrade", "User-Agent", "Via" ];

	var filterHeaders = function(headers) {
		//TODO:
		return headers;
	};

	var _request;

	if (typeof exports === "object") {
		//node    	
		var http = require('http');
		var url = require('url');
		_request = function(method, uri, headers, entity, callback) {

			console.log(uri);

			var parsedUri = url.parse(uri);
			
			console.log(parsedUri);

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
				
				//TODO: headers
				
				var responseEntity = null;
				var responseHeaders = null;
				
				var interestingHeaders = ["Content-Type", "Location"];
				
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4) {

						
						responseEntity = xhr.responseText;

						if(xhr.responseText && xhr.getResponseHeader('Content-Type') && xhr.getResponseHeader('Content-Type') === "application/json"){
							try{
								responseEntity = JSON.parse(xhr.responseText);
							}
							catch(e){
								callback(e);
								return;
							}
						}
						
						callback(null, xhr.status, responseHeaders, responseEntity);
					}
				};
				xhr.send(entity || null);
			}

		};
	}
	
	var request = function(method, uri, h, ent, callback) {
		var headers = filterHeaders(h || {});
		var entity = null;
		
		if(ent){
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
		request("POST", uri, headers || {}, entity || null, callback || function(){});
	};

	restClient.put = function(uri, headers, entity, callback) {
		request("PUT", uri, headers || {}, entity || null, callback || function(){});
	};

	restClient.del = function(uri, headers, entity, callback) {
		request("DELETE", uri, headers || {}, entity || null, callback || function(){});
	};

})();