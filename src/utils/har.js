/* eslint-disable import/prefer-default-export */

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
    const resourceType = computeResourceType(harContent.log.entries[id]);

    // eslint-disable-next-line no-param-reassign
    harContent.log.entries[id].custom = {
      // add id needed for selecting and restoring original order
      id,
      // add calculated resource type for firefox exports
      resourceType,
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
