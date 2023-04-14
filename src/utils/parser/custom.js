import { iterateObject } from "../helpers.js";
import { statusCodes } from "../http.js";

/**
 * Compute the resource type of a response.
 *
 * @param {HttpArchive.Entry} entry - The .har entry
 * @returns {string} The resource type of the response.
 */
function computeResourceType(entry) {
  if (entry.response.status === 0) {
    return "unknown";
  }

  if (entry.request.url.startsWith("ws")) {
    return "websocket";
  }

  const contentTypeHeader = entry.response.headers.find(h => h.name === "content-type");

  if (!contentTypeHeader) {
    return "unknown";
  }

  const match = contentTypeHeader.value.match(/[a-z]+\/([a-z-]+).*/);
  return match.length === 2 && match[1] ? match[1] : "unknown";
}

/**
 * compute request/response sizes.
 *
 * @param {HttpArchive.Entry.Request|HttpArchive.Entry.Response} data - The request/response data.
 * @returns {{
 *   totalSize: number,
 *   headersSizeComputed: boolean,
 *   bodySizeComputed: boolean,
 *   headersSize,
 *   bodySize: number
 * }} The computed sizes.
 */
function computeSizes(data) {
  const sizes = {
    headersSize: data.headersSize || 0,
    bodySize: data.bodySize || 0,
    totalSize: 0,
    headersSizeComputed: false,
    bodySizeComputed: false,
    totalSizeComputed: false,
  };

  if (sizes.headersSize === -1 || !sizes.headersSize) {
    if (data.method) {
      sizes.headersSize = `${data.method} ${data.url} ${data.httpVersion || "HTTP/1.1"}\r\n`.length;
    } else {
      let { statusText } = data;
      if (data.status !== 0 && !statusText) {
        statusText = statusCodes[data.status].replace("_", " ");
      }

      sizes.headersSize = `${data.status} ${statusText} ${data.httpVersion}\r\n`.length;
    }

    if (data.headers) {
      for (let i = 0; i < data.headers.length; i++) {
        sizes.headersSize += `${data.headers[i].name}: ${data.headers[i].value}\r\n`.length;
      }
    }

    if (data.headers && data.cookies) {
      sizes.headersSize += 8;
      for (let i = 0; i < data.cookies.length; i++) {
        sizes.headersSize += `${data.cookies[i].name}=${data.cookies[i].value}`.length;
      }
      sizes.headersSize += 2;
    }

    sizes.headersSize += 2;
    sizes.headersSizeComputed = true;
  }

  if (sizes.bodySize < 0 && data.content.size === 0) {
    sizes.bodySize = 0;
    sizes.bodySizeComputed = true;
  }

  if (sizes.bodySize === -1 && data.content.size) {
    sizes.bodySize = data.content.size;
    sizes.bodySizeComputed = true;
  }

  if (sizes.headersSize !== -1) {
    sizes.totalSize += sizes.headersSize;
  }

  if (sizes.bodySize !== -1) {
    sizes.totalSize += sizes.bodySize;
  }

  if (sizes.headersSizeComputed || sizes.bodySizeComputed) {
    sizes.totalSizeComputed = true;
  }

  return sizes;
}

/**
 * Compute the status type of a response.
 *
 * @param {HttpArchive.Entry.Response} response - The .har entry
 * @returns {string} The status type of the response.
 */
function computeStatusType(response) {
  switch (true) {
    case response.status === 0:
      return "blocked";
    case response.status < 200:
      return "info";
    case response.status < 300:
      return "success";
    case response.status < 400:
      return "redirect";
    case response.status < 500:
      return "client-error";
    case response.status < 600:
      return "server-error";
    default:
      return "custom";
  }
}

/**
 * Compute the status code of a response.
 *
 * @param {HttpArchive.Entry.Response} response - The .har entry
 * @returns {string} The status code of the response.
 */
function computeStatusCode(response) {
  if (response.status !== 0) {
    return response.status;
  }

  if (response._error) {
    return response._error.replace("net::", "");
  }

  return "blocked";
}

/**
 * Add custom attributes to har entry.
 *
 * @param {number} id - The new id of the entry.
 * @param {HttpArchive.Entry} entry - The entry to use.
 */
export default function addCustomProperties(id, entry) {
  const resourceType = computeResourceType(entry);
  const requestSizes = computeSizes(entry.request);
  const responseSizes = computeSizes(entry.response);
  const statusType = computeStatusType(entry.response);
  const statusCode = computeStatusCode(entry.response);

  // remove custom attributes from different tools
  iterateObject(entry, (parent, key) => {
    if (key.startsWith("_")) {
      // eslint-disable-next-line no-param-reassign
      delete parent[key];
    }
  });

  // eslint-disable-next-line no-param-reassign
  entry._harviewer = {
    id,
    resourceType,
    request: requestSizes,
    response: responseSizes,
    statusType,
    statusCode,
    url: entry.request.url.split("?")[0],
    hasImageResponse: entry.response.content.encoding === "base64"
      && entry.response.content.mimeType && entry.response.content.mimeType.startsWith("image/")
      && entry.response.content.text,
    webSocketMessages: entry._webSocketMessages,
  };
}
