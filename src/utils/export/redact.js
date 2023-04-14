/* eslint-disable import/prefer-default-export */

import { iterateObject } from "../helpers.js";

const sensitiveKeys = [
  "authorization",
  "email",
  "password",
  "client_id",
  "client_secret",
  "token",
  "access_token",
  "id_token",
];

/**
 * Redact har data.
 *
 * @param {HttpArchive.Entry[]} sensitiveData - The data to redact.
 * @param {string[]} wordList - A custom redaction word list.
 */
export default function redactData(sensitiveData, wordList) {
  if (wordList) {
    // eslint-disable-next-line no-param-reassign
    wordList = wordList.split(",");
  }

  iterateObject(sensitiveData, (parent, key) => {
    if (key === "name" && (wordList || sensitiveKeys).includes(parent.name.toLowerCase())) {
      // eslint-disable-next-line no-param-reassign
      parent.value = "*** Redacted ***";
    } else if ((wordList || sensitiveKeys).includes(key.toLowerCase())) {
      // eslint-disable-next-line no-param-reassign
      parent[key] = "*** Redacted ***";
    }
  });
}
