# rest-client.js

A thin, environment-agnostic helper for RESTful web service clients in JavaScript. 

This helper provides a simple API to interact with a RESTful web service, abstracting from the underlying mechanisms. 

## FAQ

> Is this a fully-featured HTTP client?

No, it is not. It's rather a very thin abstraction layer to use the same code base for high-level JavaScript-based clients to RESTful web services. It is currently designed to work with PhoneGap and node.js


> Can I use it in the browser?

This helper library has not been designed for usage inside browsers (except PhoneGap) so far. Please note that PhoneGap circumvents the Same-Origin-Policy, which is not addressed in rest-client.js. 


## Usage

Node.js:

	var restClient = require('rest-client.js');

Browser (PhoneGap!):

	<script type="text/javascript" charset="utf-8" src="rest-client.js"></script>
	<script>
	var restClient = this.restClient;
	</script>

### API

tbd.

## See Also

If you are in search of a more powerful solution, you should have a look at https://github.com/coolaj86/abstract-http-request


## License


	Copyright (c) 2011 Benjamin Erb

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


