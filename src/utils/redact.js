/* eslint-disable import/prefer-default-export */

import { iterateObject } from "./helpers";

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

export const redactData = (sensitiveData, wordList) => {
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
};
