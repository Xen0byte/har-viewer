/* eslint-disable import/prefer-default-export */

/**
 * Keys that are required for a HAR file.
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
 * Read a file's contents.
 *
 * @param {File} file - The file to read.
 * @return {Promise<string|Error>}
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
 * Parse a given HAR file.
 *
 * @param {File} file - The HAR file to parse.
 * @return {Promise<Object|Error>}
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

  return harContent.log;
}
