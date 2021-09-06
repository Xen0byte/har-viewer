/* eslint-disable import/prefer-default-export */

/**
 * Generate a rfc4122 compliant v4 uuid.
 *
 * @returns {string} A rfc4122 compliant v4 uuid.
 */
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0;
    const
      // eslint-disable-next-line no-mixed-operators,no-bitwise
      v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a postman v1.x file.
 *
 * @param {string} name - The name of the collection.
 * @param {object} data - The data to serialize.
 * @returns {object} A postman v1.x file.
 */
function v1(name, data) {
  const collectionId = uuidv4();

  const order = [];
  const requests = [];

  for (let i = 0; i < data.log.entries.length; i++) {
    const entry = data.log.entries[i];
    const uuid = uuidv4();

    order.push(uuid);

    let dataMode = null;
    let postData = null;

    if (entry.request.postData) {
      switch (entry.request.postData.mimeType) {
        case "application/x-www-form-urlencoded":
          dataMode = "urlencoded";
          break;
        case "application/octet-stream":
          dataMode = "binary";
          break;
        default:
          dataMode = "raw";
          break;
      }

      postData = entry.request.postData.params.map(p => ({
        key: p.name,
        value: p.value,
      }));
    }

    requests.push({
      id: uuid,
      method: entry.request.method.toUpperCase(),
      url: entry.request.url,
      headers: entry.request.headers
        .map(h => `${h.name}: ${h.value}`)
        .join("\n"),
      name: entry.request.url.split("?")[0],
      time: Math.round(+new Date(entry.startedDateTime) / 1000),
      dataMode,
      data: postData,
      responses: [{
        request: uuid,
        id: uuidv4(),
        responseCode: entry.response.status,
        headers: entry.response.headers.map(h => ({
          key: h.name,
          value: h.value,
        })),
        mime: entry.response.content.mimeType,
        text: entry.response.content.text,
      }],
      description: entry.response.status === 0 ? "Blocked" : null,
      collectionId,
    });
  }

  return {
    id: collectionId,
    name,
    description: "Generated by HTTP Archive Viewer",
    order,
    timestamp: Math.round(+new Date() / 1000),
    requests,
  };
}

/**
 * Generate a postman v2.x file.
 *
 * @param {string} name - The name of the collection.
 * @param {object} data - The data to serialize.
 * @param {string} version - The postman format version.
 * @returns {object} A postman v2.x file.
 */
function v2(name, data, version) {
  const collectionId = uuidv4();
  const items = [];

  for (let i = 0; i < data.log.entries.length; i++) {
    const entry = data.log.entries[i];
    const uuid = uuidv4();

    let dataMode = null;
    let postData = null;

    if (entry.request.postData) {
      switch (entry.request.postData.mimeType) {
        case "application/x-www-form-urlencoded":
          dataMode = "urlencoded";
          break;
        case "application/octet-stream":
          dataMode = "binary";
          break;
        default:
          dataMode = "raw";
          break;
      }

      postData = entry.request.postData.params.map(p => ({
        key: p.name,
        value: p.value,
      }));
    }

    const reqBody = {
      mode: dataMode,
    };

    // TODO: add raw data
    // TODO: add formdata
    // TODO: add binary
    if (dataMode === "urlencoded") {
      reqBody.urlencoded = postData;
    }

    items.push({
      id: uuid,
      name: entry.request.url.split("?")[0],
      description: entry.response.status === 0 ? "Blocked" : null,
      request: {
        url: entry.request.url,
        method: entry.request.method.toUpperCase(),
        header: entry.request.headers.map(h => ({
          key: h.name,
          value: h.value,
        })),
        body: reqBody,
      },
      response: [{
        id: uuidv4(),
        originalRequest: uuid,
        responseTime: entry.time,
        header: entry.response.headers.map(h => ({
          key: h.name,
          value: h.value,
        })),
        body: entry.response.content.text,
        status: `${entry.response.status} ${entry.response.statusText}`,
        code: entry.response.status,
      }],
    });
  }

  return {
    info: {
      name,
      schema: `https://schema.getpostman.com/json/collection/v${version}/collection.json`,
      description: "Generated by HTTP Archive Viewer",
      _postman_id: collectionId,
    },
    item: items,
  };
}

// https://schema.postman.com/
export const postmanVersions = [
  "1.x",
  "2.0.0",
  "2.1.0",
];

export const toPostman = (name, data, version) => {
  switch (version) {
    case "1.x":
      return v1(name, data);
    case "2.0.0":
    case "2.1.0":
      return v2(name, data, version);
    default:
      return null;
  }
};
