/* eslint-disable import/prefer-default-export */
/* global HttpArchive */

import { compare, readFile, iterateObject } from "./helpers";
import { statusCodes } from "./http";

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
 * @param {HttpArchive.Entry} data - The .har entry
 * @returns {string} The resource type of the response.
 */
function computeResourceType(data) {
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

  // TODO: use regex
  return contentTypeHeader.value.split("/")[1].split(";")[0].split("+")[0];
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
        statusText = statusCodes[data.status];
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
 * Check if object is a valid HAR file.
 *
 * @param {HttpArchive} harContent - The HAR file contents.
 * @returns {Promise<HttpArchive>} The checked har file.
 */
export function checkHar(harContent) {
  // check required keys
  for (let i = 0; i < requiredKeys.length; i++) {
    const hasKey = !!requiredKeys[i]
      .split(".")
      .reduce((obj, key) => obj[key], harContent);

    if (!hasKey) {
      // eslint-disable-next-line no-console
      console.error(`missing key: ${requiredKeys[i]}`);
      throw errInvalid;
    }
  }

  for (let id = 0; id < harContent.log.entries.length; id++) {
    const data = harContent.log.entries[id];

    data.request.headers.sort((a, b) => compare(a.name, b.name));
    data.request.cookies.sort((a, b) => compare(a.name, b.name));
    data.response.headers.sort((a, b) => compare(a.name, b.name));
    data.response.cookies.sort((a, b) => compare(a.name, b.name));

    if (data.request.queryString) {
      data.request.queryString.sort((a, b) => compare(a.name, b.name));
    }

    if (data.request.postData && data.request.postData.params) {
      data.request.postData.params.sort((a, b) => compare(a.name, b.name));
    }

    const resourceType = computeResourceType(data);
    const requestSizes = computeSizes(data.request);
    const responseSizes = computeSizes(data.response);

    let statusType = "";
    switch (true) {
      case data.response.status === 0:
        statusType = "blocked";
        break;
      case data.response.status < 200:
        statusType = "info";
        break;
      case data.response.status < 300:
        statusType = "success";
        break;
      case data.response.status < 400:
        statusType = "redirect";
        break;
      case data.response.status < 500:
        statusType = "client-error";
        break;
      case data.response.status < 600:
        statusType = "server-error";
        break;
      default:
        statusType = "custom";
        break;
    }

    let statusCode = "unknown";
    if (data.response.status !== 0) {
      statusCode = data.response.status;
    } else if (data.response._error) {
      statusCode = data.response._error.replace("net::", "");
    } else {
      statusCode = "blocked";
    }

    const webSocketMessages = data._webSocketMessages;

    // remove custm properties
    iterateObject(data, (parent, key) => {
      if (key.startsWith("_")) {
        // eslint-disable-next-line no-param-reassign
        delete parent[key];
      }
    });

    // eslint-disable-next-line no-param-reassign
    data._harviewer = {
      resourceType,
      request: requestSizes,
      response: responseSizes,
      statusType,
      statusCode,
      url: data.request.url.split("?")[0],
      hasImageResponse: data.response.content.encoding === "base64"
        && data.response.content.mimeType.startsWith("image/")
        && data.response.content.text,
      webSocketMessages,
    };
  }

  return harContent.log;
}

/**
 * Parse a given HAR file.
 *
 * @param {File} file - The HAR file to parse.
 * @returns {Promise<HttpArchive|Error>} The parsed har file or an error.
 */
export async function parseHarFile(file) {
  if (file.type && file.type !== "application/json") {
    // eslint-disable-next-line no-console
    console.error("mime type does not match");
    throw errInvalid;
  }

  // parse file
  const content = await readFile(file);
  const harContent = JSON.parse(content);

  return checkHar(harContent);
}
