# About CORS


Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. This security measure helps prevent potentially malicious actions and protects sensitive data.

When a web page makes an HTTP request to a different domain, the browser enforces the Same-Origin Policy, which generally blocks such requests. However, CORS allows servers to include specific headers in their responses, indicating which origins are permitted to access the resources on the server.

Now, for certain types of requests, known as "complex" requests, the browser initiates a pre-flight check by sending an OPTIONS request to the server before the actual request. This pre-flight request is an additional step taken by the browser to determine whether the actual request should be allowed.

Complex requests are those that fall into one or more of the following categories:

1.  Requests that use methods other than GET, HEAD, or POST.
2.  Requests that include headers other than simple headers. Simple headers include common headers like Accept, Accept-Language, Content-Language, etc.
3.  Requests that include certain types of content, such as content types other than application/x-www-form-urlencoded, multipart/form-data, or text/plain.

To perform the pre-flight check, the browser sends an OPTIONS request to the server, including the relevant information about the actual request (HTTP method, headers, etc.). The server responds with the appropriate CORS headers, indicating whether the actual request from the web page is allowed.

If the server responds favorably to the pre-flight request, the browser proceeds to make the actual request. Otherwise, it prevents the actual request from being sent, adhering to the security measures defined by CORS. This mechanism helps ensure that only trusted and authorized requests are made across different origins, enhancing web security.

**NOTE:** When using this middleware as an application level middleware (for example, app.use(cors())), pre-flight requests are already handled for all routes.

## Configuration Options
**origin:** Configures the Access-Control-Allow-Origin CORS header. Possible values:

- **Boolean** - set origin to true to reflect the request origin, as defined by req.header('Origin'), or set it to false to disable CORS.

- **String** - set origin to a specific origin. For example if you set it to "http://example.com" only requests from “http://example.com” will be allowed.

- **RegExp** - set origin to a regular expression pattern which will be used to test the request origin. If it’s a match, the request origin will be reflected. For example the pattern /example\.com$/ will reflect any request that is coming from an origin ending with “example.com”.

- **Array** - set origin to an array of valid origins. Each origin can be a String or a RegExp. For example ["http://example1.com", /\.example2\.com$/] will accept any request from “http://example1.com” or from a subdomain of “example2.com”.

- **Function** - set origin to a function implementing some custom logic. The function takes the request origin as the first parameter and a callback (called as callback(err, origin), where origin is a non-function value of the origin option) as the second.

- **methods**: Configures the Access-Control-Allow-Methods CORS header. Expects a comma-delimited string (ex: ‘GET,PUT,POST’) or an array (ex: ['GET', 'PUT', 'POST']).

- **allowedHeaders**: Configures the Access-Control-Allow-Headers CORS header. Expects a comma-delimited string (ex: ‘Content-Type,Authorization’) or an array (ex: ['Content-Type', 'Authorization']). If not specified, defaults to reflecting the headers specified in the request’s Access-Control-Request-Headers header.

- **exposedHeaders**: Configures the Access-Control-Expose-Headers CORS header. Expects a comma-delimited string (ex: ‘Content-Range,X-Content-Range’) or an array (ex: ['Content-Range', 'X-Content-Range']). If not specified, no custom headers are exposed.

- **credentials**: Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.

- **maxAge:** Configures the Access-Control-Max-Age CORS header. Set to an integer to pass the header, otherwise it is omitted.
preflightContinue: Pass the CORS preflight response to the next handler.

- **optionsSuccessStatus:** Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.

The default configuration is the equivalent of:

```
{
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
```

Reff: https://web.dev/articles/cross-origin-resource-sharing