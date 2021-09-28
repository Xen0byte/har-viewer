/**
 * This object contains information about the log creator application.
 *
 * @typedef {(object)} HttpArchive.Creator
 * @property {(string)} name - The name of the application that created the log.
 * @property {(string)} version - The version number of the application that created the log.
 * @property {(string)} [comment] - A comment provided by the user or the application.
 */

/**
 * This object contains information about the browser that created the log.
 *
 * @typedef {(object)} HttpArchive.Browser
 * @property {(string)} name - The name of the browser that created the log.
 * @property {(string)} version - The version number of the browser that created the log.
 * @property {(string)} [comment] - A comment provided by the user or the browser.
 */

/**
 * This object represents an exported page.
 *
 * @typedef {(object)} HttpArchive.Page
 * @property {(string)} startedDateTime - Date and time stamp for the beginning of the page load.
 * @property {(string)} id - Unique identifier of a page within the . Entries use it to refer the parent page.
 * @property {(string)} title - Page title.
 * @property {(HttpArchive.Page.Timings)} pageTimings - Detailed timing info about page load.
 * @property {(string)} [comment] - A comment provided by the user or the application.
 */

/**
 * This object represents an exported HTTP request.
 *
 * @typedef {(object)} HttpArchive.Entry
 * @property {(string)} [pageref] - Reference to the parent page.
 * @property {(string)} startedDateTime - Date and time stamp of the request start.
 * @property {(number)} time - Total elapsed time of the request in milliseconds.
 *   This is the sum of all timings available in the timings object (i.e. not including -1 values) .
 * @property {(HttpArchive.Entry.Request)} request - Detailed info about the request.
 * @property {(HttpArchive.Entry.Response)} response - Detailed info about the response.
 * @property {(HttpArchive.Entry.Cache)} cache - Info about cache usage.
 * @property {(HttpArchive.Entry.Timings)} timings - Detailed timing info about request/response round trip.
 * @property {(string)} [serverIPAddress] - IP address of the server that was connected (result of DNS resolution).
 * @property {(string)} [connection] - Unique ID of the parent TCP/IP connection, can be the client port number.
 *   Note that a port number doesn't have to be unique identifier in cases where the port is shared for more
 *   connections. If the port isn't available for the application, any other unique connection ID can be used instead
 *   (e.g. connection index).
 * @property {(string)} [comment] - A comment provided by the user or the application.
 * @property {(CustomEntryProps)} _customProps - Custom properties generated by this application.
 */

/**
 * This object represents an exported HTTP request.
 *
 * The total request size sent can be computed as follows (if both values are available):
 * <code>var totalSize = headersSize + bodySize;</code>
 *
 * @typedef {(object)} HttpArchive.Entry.Request
 * @property {string} method - Request method (GET, POST, ...).
 * @property {string} url - Absolute URL of the request (fragments are not included).
 * @property {string} httpVersion - Request HTTP Version.
 * @property {HttpArchive.Entry.Cookie[]} cookies - List of cookie objects.
 * @property {HttpArchive.Entry.Header[]} headers - List of header objects.
 * @property {HttpArchive.Entry.Request.QueryParameter[]} queryString - List of query parameter objects.
 * @property {HttpArchive.Entry.Request.PostData} [postData] - Posted data info.
 * @property {number} headersSize - Total number of bytes from the start of the HTTP request message until
 *   (and including) the double CRLF before the body. Set to -1 if the info is not available.
 * @property {number} bodySize - Size of the request body (POST data payload) in bytes.
 *   Set to -1 if the info is not available.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object contains detailed info about the response.
 *
 * The total response size received can be computed as follows (if both values are available):
 * <code>var totalSize = headersSize + bodySize;</code>
 *
 * @typedef {(object)} HttpArchive.Entry.Response
 * @property {number} status - Response status.
 * @property {string} statusText - Response status description.
 * @property {string} httpVersion - Response HTTP Version.
 * @property {HttpArchive.Entry.Cookie[]} cookies - List of cookie objects.
 * @property {HttpArchive.Entry.Header[]} headers - List of header objects.
 * @property {HttpArchive.Entry.Response.Content} content - Details about the response body.
 * @property {string} redirectURL - Redirection target URL from the Location response header.
 * @property {number} headersSize - Total number of bytes from the start of the HTTP response message until
 *   (and including) the double CRLF before the body. Set to -1 if the info is not available.
 *   The size of received response-headers is computed only from headers that are really received from the server.
 *   Additional headers appended by the browser are not included in this number, but they appear in the list of
 *   header objects.
 * @property {number} bodySize - Size of the received response body in bytes. Set to zero in case of responses coming
 *   from the cache (304). Set to -1 if the info is not available.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object contains a cookies properties.
 *
 * @typedef {(object)} HttpArchive.Entry.Cookie
 * @property {string} name - The name of the cookie.
 * @property {string} value - The cookie value.
 * @property {string} [path] - The path pertaining to the cookie.
 * @property {string} [domain] - The host of the cookie.
 * @property {string} [expires] - Cookie expiration time.
 * @property {boolean} [httpOnly] - Set to true if the cookie is HTTP only, false otherwise.
 * @property {boolean} [secure] - True if the cookie was transmitted over ssl, false otherwise.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object contains a headers properties.
 *
 * @typedef {(object)} HttpArchive.Entry.Header
 * @property {string} name - The name of the header.
 * @property {string} value - The value of the header.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object contains a query parameters properties.
 *
 * @typedef {(object)} HttpArchive.Entry.Request.QueryParameter
 * @property {string} name - The name of the query parameter.
 * @property {string} value - The value of the query parameter.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object describes posted data.
 *
 * @typedef {(object)} HttpArchive.Entry.Request.PostData
 * @property {string} mimeType - Mime type of posted data.
 * @property {HttpArchive.Entry.Request.PostData.Param[]} params - List of posted parameters
 *   (in case of URL encoded parameters).
 * @property {string} text - Plain text posted data
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * Posted parameter.
 *
 * @typedef {(object)} HttpArchive.Entry.Request.PostData.Param
 * @property {string} name - The name of the posted parameter.
 * @property {string} [value] - The value of the posted parameter.
 * @property {string} [fileName] - Name of a posted file.
 * @property {string} [contentType] - Content type of a posted file.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object describes details about response content.
 *
 * @typedef {(object)} HttpArchive.Entry.Response.Content
 * @property {number} size - Length of the returned content in bytes. Should be equal to response.bodySize if there is
 *   no compression and bigger when the content has been compressed.
 * @property {number} [compression] - Number of bytes saved.
 * @property {string} mimeType - MIME type of the response text (value of the Content-Type response header). The
 *   charset attribute of the MIME type is included (if available).
 * @property {string} [text] - Response body sent from the server or loaded from the browser cache. This field is
 *   populated with textual content only. The text field is either HTTP decoded text or a encoded (e.g. "base64")
 *   representation of the response body.
 * @property {string} [encoding] - Encoding used for response text field e.g "base64".
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This objects contains info about a request coming from browser cache.
 *
 * @typedef {(object)} HttpArchive.Entry.Cache
 * @property {HttpArchive.Entry.Cache.Part} [beforeRequest] - State of a cache entry before the request.
 * @property {HttpArchive.Entry.Cache.Part} [afterRequest] - State of a cache entry after the request.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * Both beforeRequest and afterRequest object share the following structure.
 *
 * @typedef {(object)} HttpArchive.Entry.Cache.Part
 * @property {string} [expires] - Expiration time of the cache entry.
 * @property {string} lastAccess - The last time the cache entry was opened.
 * @property {string} eTag - Etag.
 * @property {number} hitCount - The number of times the cache entry has been opened.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object represents an exported HTTP request.
 *
 * @typedef {(object)} HttpArchive.Entry.Timings
 * @property {number} [blocked] - Time spent in a queue waiting for a network connection.
 * @property {number} [dns] - DNS resolution time. The time required to resolve a host name.
 * @property {number} [connect] - Time required to create TCP connection.
 * @property {number} send - Time required to send HTTP request to the server.
 * @property {number} wait - Waiting for a response from the server.
 * @property {number} receive - Time required to read entire response from the server (or cache).
 * @property {number} [ssl] - Time required for SSL/TLS negotiation. If this field is defined then the time is also
 *   included in the connect field.
 * @property {string} [comment] - A comment provided by the user or the application.
 */

/**
 * This object describes timings for various events (states) fired during the page load.
 * All times are specified in milliseconds. If a time info is not available appropriate field is set to -1.
 *
 * @typedef {(object)} HttpArchive.Page.Timings
 * @property {(number)} onContentLoad - Content of the page loaded. Number of milliseconds since page load started.
 * @property {(number)} onLoad - Page is loaded (onLoad event fired). Number of milliseconds since page load started.
 * @property {(string)} [comment] - A comment provided by the user or the application.
 */

/**
 * This object represents the root of the exported data.
 *
 * @typedef {(object)} HttpArchive.Log
 * @property {(string)} version - Version number of the format.
 * @property {(HttpArchive.Creator)} creator - Contains the name and version information of the log creator application.
 * @property {(HttpArchive.Browser)} [browser] - Contains the name and version information of the user agent.
 * @property {(HttpArchive.Page[])} [pages] - An array of pages, each representing one exported page.
 * @property {(HttpArchive.Entry[])} entries - An array of entries, each representing one exported HTTP request.
 * @property {(string)} [comment] - A comment provided by the user or the application.
 */

/**
 * The http archive file structure.
 *
 * @typedef {(object)} HttpArchive
 * @property {(HttpArchive.Log)} log - The exported data.
 */

/**
 * Custom entry properties.
 *
 * @typedef {(object)} CustomEntryProps
 * @property {(number)} id - Used for selecting and restoring order.
 * @property {(string)} resourceType - Type of the resource.
 * @property {(CustomEntryProps.Request)} request - Type of the resource.
 * @property {(CustomEntryProps.Response)} response - Type of the resource.
 */

/**
 * Custom entry request properties.
 *
 * @typedef {(object)} CustomEntryProps.Request
 * @property {(string)} url - URL of the request (without path and parameters).
 * @property {(number)} headersSize - computed header size.
 * @property {(number)} bodySize - computed body size.
 * @property {(boolean)} headersSizeComputed - Indicates whether the header size is computed or not.
 * @property {(boolean)} bodySizeComputed - Indicates whether the body size is computed or not.
 */

/**
 * Custom entry response properties.
 *
 * @typedef {(object)} CustomEntryProps.Response
 * @property {(string)} statusType - Type of the status code.
 * @property {(number|string)} statusCode - Status code or description.
 * @property {(number)} headersSize - computed header size.
 * @property {(number)} bodySize - computed body size.
 * @property {(boolean)} headersSizeComputed - Indicates whether the header size is computed or not.
 * @property {(boolean)} bodySizeComputed - Indicates whether the body size is computed or not.
 */