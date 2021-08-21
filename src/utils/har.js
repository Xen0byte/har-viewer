/* eslint-disable import/prefer-default-export */

import { compare } from "./array";

/**
 * Keys that are required for a HAR file.
 *
 * @type {string[]}
 */
const requiredKeys = [
  "log",
  "log.version",
  "log.creator",
  "log.creator.name",
  "log.creator.version",
  "log.entries",
];

/**
 * This error is thrown if the provided HAR file is invalid.
 *
 * @type {Error}
 */
const errInvalid = new Error("invalid HAR file");

/**
 * Compute the resource type of a response.
 *
 * @param {object} data - The .har entry
 * @returns {string} The resource type of the response.
 */
function computeResourceType(data) {
  // eslint-disable-next-line no-underscore-dangle
  if (data._resourceType) {
    // eslint-disable-next-line no-underscore-dangle
    return data._resourceType;
  }

  if (data.response.status === 0) {
    return "unknown";
  }

  if (data.request.url.startsWith("ws")) {
    return "websocket";
  }

  const contentTypeHeader = data.response.headers.find(h => h.name === "content-type");

  if (!contentTypeHeader) {
    return "unknown";
  }

  switch (true) {
    case contentTypeHeader.value.includes("text/html"):
      return "document";
    case contentTypeHeader.value.includes("application/javascript")
    || contentTypeHeader.value.includes("text/javascript"):
      return "script";
    case contentTypeHeader.value.includes("text/css"):
      return "stylesheet";
    case contentTypeHeader.value.includes("image/"):
      return "image";
    case contentTypeHeader.value.includes("font/"):
      return "font";
    case contentTypeHeader.value.includes("application/json"):
      return "fetch";
    case contentTypeHeader.value.includes("text/plain"):
      return "plain";
    default:
      return "unknown";
  }
}

/**
 * compute request/response sizes.
 *
 * @param {object} data - The request/response data.
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
    headersSize: data.headersSize,
    bodySize: data.bodySize,
    totalSize: 0,
    headersSizeComputed: false,
    bodySizeComputed: false,
    totalSizeComputed: false,
  };

  if (sizes.headersSize === -1) {
    if (data.method) {
      sizes.headersSize = `${data.method} ${data.url} ${data.httpVersion}\r\n`.length;
    } else {
      let { statusText } = data;
      if (data.status !== 0 && !statusText) {
        // TODO: add more status texts
        switch (data.status) {
          case 200:
            statusText = "OK";
            break;
          default:
            break;
        }
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
 * Read a file's contents.
 *
 * @param {File} file - The file to read.
 * @returns {Promise<string|Error>} The file contents or an error.
 */
async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}

/**
 * Check if object is a valid HAR file.
 *
 * @param {object} harContent - The HAR file contents.
 * @returns {Promise<object|Error>} The checked har file.
 */
export function checkHar(harContent) {
  // check required keys
  for (let i = 0; i < requiredKeys.length; i++) {
    const hasKey = !!requiredKeys[i]
      .split(".")
      .reduce((obj, key) => obj[key], harContent);

    if (!hasKey) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.error(`missing key: ${requiredKeys[i]}`);
      }

      throw errInvalid;
    }
  }

  for (let id = 0; id < harContent.log.entries.length; id++) {
    const data = harContent.log.entries[id];

    harContent.log.entries[id].request.headers.sort((a, b) => compare(a.name, b.name));
    harContent.log.entries[id].request.cookies.sort((a, b) => compare(a.name, b.name));
    harContent.log.entries[id].response.headers.sort((a, b) => compare(a.name, b.name));
    harContent.log.entries[id].response.cookies.sort((a, b) => compare(a.name, b.name));

    if (data.request.queryString) {
      harContent.log.entries[id].request.queryString.sort((a, b) => compare(a.name, b.name));
    }

    if (data.request.postData && data.request.postData.params) {
      harContent.log.entries[id].request.postData.params.sort((a, b) => compare(a.name, b.name));
    }

    const resourceType = computeResourceType(data);
    const requestSizes = computeSizes(data.request);
    const responseSizes = computeSizes(data.response);

    let statusType = "";
    switch (true) {
      case data.response.status === 0:
        // eslint-disable-next-line no-underscore-dangle
        statusType = data.response._error ? "error" : "unknown";
        break;
      case data.response.status < 200:
        statusType = "info";
        break;
      case data.response.status < 300:
        statusType = "success";
        break;
      case data.response.status < 400:
        statusType = "info";
        break;
      case data.response.status < 500:
        statusType = "warning";
        break;
      case data.response.status < 600:
        statusType = "error";
        break;
      default:
        statusType = "unknown";
        break;
    }

    let statusCode = "unknown";
    if (data.response.status !== 0) {
      statusCode = data.response.status;
    }
    // eslint-disable-next-line no-underscore-dangle
    if (data.response._error) {
      // eslint-disable-next-line no-underscore-dangle
      statusCode = data.response._error.replace("net::", "");
    }

    // eslint-disable-next-line no-param-reassign
    harContent.log.entries[id].custom = {
      // add id needed for selecting and restoring original order
      id,
      // add calculated resource type for firefox exports
      resourceType,
      request: requestSizes,
      response: responseSizes,
      statusType,
      statusCode,
      url: data.request.url.split("?")[0],
      hasImageResponse: data.response.content.encoding === "base64"
        && data.response.content.mimeType.startsWith("image/")
        && data.response.content.text,
    };
  }

  return harContent.log;
}

/**
 * Parse a given HAR file.
 *
 * @param {File} file - The HAR file to parse.
 * @returns {Promise<object|Error>} The parsed har file or an error.
 */
export async function parseHarFile(file) {
  if (file.type && file.type !== "application/json") {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error("mime type does not match");
    }

    throw errInvalid;
  }

  // parse file
  const content = await readFile(file);
  const harContent = JSON.parse(content);

  return checkHar(harContent);
}
