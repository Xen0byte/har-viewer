/* eslint-disable import/prefer-default-export */

/**
 * HTTP Status Code - Status Text mappings.
 *
 * @type {{
 *   "431": string,
 *   "510": string,
 *   "511": string,
 *   "200": string,
 *   "201": string,
 *   "202": string,
 *   "400": string,
 *   "444": string,
 *   "203": string,
 *   "401": string,
 *   "204": string,
 *   "402": string,
 *   "205": string,
 *   "403": string,
 *   "206": string,
 *   "404": string,
 *   "207": string,
 *   "405": string,
 *   "449": string,
 *   "208": string,
 *   "406": string,
 *   "407": string,
 *   "408": string,
 *   "409": string,
 *   "451": string,
 *   "410": string,
 *   "411": string,
 *   "499": string,
 *   "412": string,
 *   "413": string,
 *   "414": string,
 *   "415": string,
 *   "416": string,
 *   "417": string,
 *   "418": string,
 *   "419": string,
 *   "100": string,
 *   "101": string,
 *   "420": string,
 *   "102": string,
 *   "300": string,
 *   "421": string,
 *   "103": string,
 *   "301": string,
 *   "422": string,
 *   "302": string,
 *   "423": string,
 *   "500": string,
 *   "226": string,
 *   "303": string,
 *   "424": string,
 *   "501": string,
 *   "304": string,
 *   "425": string,
 *   "502": string,
 *   "305": string,
 *   "426": string,
 *   "503": string,
 *   "504": string,
 *   "307": string,
 *   "428": string,
 *   "505": string,
 *   "308": string,
 *   "429": string,
 *   "506": string,
 *   "507": string,
 *   "508": string
 * }}
 */
export const statusCodes = {
  100: "CONTINUE",
  101: "SWITCHING PROTOCOLS",
  102: "PROCESSING",
  103: "EARLY HINTS",
  200: "OK",
  201: "CREATED",
  202: "ACCEPTED",
  203: "NON AUTHORITATIVE INFORMATION",
  204: "NO CONTENT",
  205: "RESET CONTENT",
  206: "PARTIAL CONTENT",
  207: "MULTI STATUS",
  208: "ALREADY REPORTED",
  226: "IM USED",
  300: "MULTIPLE CHOICES",
  301: "MOVED PERMANENTLY",
  302: "MOVED TEMPORARILY",
  303: "SEE OTHER",
  304: "NOT MODIFIED",
  305: "USE PROXY",
  307: "TEMPORARY REDIRECT",
  308: "PERMANENT REDIRECT",
  400: "BAD REQUEST",
  401: "UNAUTHORIZED",
  402: "PAYMENT REQUIRED",
  403: "FORBIDDEN",
  404: "NOT FOUND",
  405: "METHOD NOT ALLOWED",
  406: "NOT ACCEPTABLE",
  407: "PROXY AUTHENTICATION REQUIRED",
  408: "REQUEST TIMEOUT",
  409: "CONFLICT",
  410: "GONE",
  411: "LENGTH REQUIRED",
  412: "PRECONDITION FAILED",
  413: "REQUEST TOO LONG",
  414: "REQUEST URI TOO LONG",
  415: "UNSUPPORTED MEDIA TYPE",
  416: "REQUESTED RANGE NOT SATISFIABLE",
  417: "EXPECTATION FAILED",
  418: "IM A TEAPOT",
  419: "INSUFFICIENT SPACE ON RESOURCE",
  420: "POLICY NOT FULFILLED",
  421: "MISDIRECTED REQUEST",
  422: "UNPROCESSABLE ENTITY",
  423: "LOCKED",
  424: "FAILED DEPENDENCY",
  425: "TOO EARLY",
  426: "UPGRADE REQUIRED",
  428: "PRECONDITION REQUIRED",
  429: "TOO MANY REQUESTS",
  431: "REQUEST HEADER FIELDS TOO LARGE",
  444: "NO RESPONSE",
  449: "THE REQUEST SHOULD BE RETRIED AFTER DOING THE APPROPRIATE ACTION",
  451: "UNAVAILABLE FOR LEGAL REASONS",
  499: "CLIENT CLOSED REQUEST",
  500: "INTERNAL SERVER ERROR",
  501: "NOT IMPLEMENTED",
  502: "BAD GATEWAY",
  503: "SERVICE UNAVAILABLE",
  504: "GATEWAY TIMEOUT",
  505: "HTTP VERSION NOT SUPPORTED",
  506: "VARIANT ALSO NEGOTIATES",
  507: "INSUFFICIENT STORAGE",
  508: "LOOP DETECTED",
  510: "NOT EXTENDED",
  511: "NETWORK AUTHENTICATION REQUIRED",
};