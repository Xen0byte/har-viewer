/* eslint-disable import/prefer-default-export */

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

const iterate = (obj, cb) => {
  Object.keys(obj)
    .forEach(key => {
      if (typeof obj[key] === "object") {
        iterate(obj[key], cb);
      } else {
        cb(obj, key);
      }
    });
};

export const redactData = (sensitiveData, wordList) => {
  if (wordList) {
    // eslint-disable-next-line no-param-reassign
    wordList = wordList.split(",");
  }

  iterate(sensitiveData, (parent, key) => {
    if (key === "name" && (wordList || sensitiveKeys).includes(parent.name.toLowerCase())) {
      // eslint-disable-next-line no-param-reassign
      parent.value = "*** Redacted ***";
    } else if ((wordList || sensitiveKeys).includes(key.toLowerCase())) {
      // eslint-disable-next-line no-param-reassign
      parent[key] = "*** Redacted ***";
    }
  });
};
