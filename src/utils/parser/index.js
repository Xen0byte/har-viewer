import { compare } from "../helpers.js";
import addCustomData from "./custom.js";

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
 * Validate a har file.
 *
 * @param {HttpArchive} data - The data to validate.
 */
function validateHarFile(data) {
  // check required keys
  for (let i = 0; i < requiredKeys.length; i++) {
    const hasKey = !!requiredKeys[i]
      .split(".")
      .reduce((obj, key) => obj[key], data);

    if (!hasKey) {
      // eslint-disable-next-line no-console
      console.error(`missing key: ${requiredKeys[i]}`);
      throw new Error(`invalid HAR file: missing key '${requiredKeys[i]}'`);
    }
  }
}

/**
 * Sort entry parameters: 'headers', 'cookies', 'queryString', 'postData'.
 *
 * @param {HttpArchive.Entry} entry - The entry to sort.
 */
function sortParameters(entry) {
  const sortFunc = (a, b) => compare(a.name, b.name);

  entry.request.headers.sort(sortFunc);
  entry.request.cookies.sort(sortFunc);
  entry.response.headers.sort(sortFunc);
  entry.response.cookies.sort(sortFunc);

  if (entry.request.queryString) {
    entry.request.queryString.sort(sortFunc);
  }

  if (entry.request.postData && entry.request.postData.params) {
    entry.request.postData.params.sort(sortFunc);
  }
}

/**
 * Parse data to HttpArchive.
 *
 * @param {HttpArchive} data - The data to parse.
 * @returns {HttpArchive.Log} - The parsed data.
 */
export default function parseHar(data) {
  validateHarFile(data);

  // ensure sorted data
  data.log.entries.sort((a, b) => compare(a.startedDateTime, b.startedDateTime));

  for (let i = 0; i < data.log.entries.length; i++) {
    const entry = data.log.entries[i];

    sortParameters(entry);
    addCustomData(i, entry);
  }

  return data.log;
}
