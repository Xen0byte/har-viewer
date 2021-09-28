/**
 * CSV generation options.
 *
 * @typedef {(object)} CSVOptions
 * @property {string} delimiter - Column delimiter character.
 * @property {boolean} msExcelCompatible - Prepend MS Excel header.
 */

/**
 * Default csv export options.
 *
 * @type {CSVOptions}
 */
const defaultOptions = {
  delimiter: ",",
  msExcelCompatible: false,
};

/**
 * Generate a csv string from given data.
 *
 * @param {HttpArchive} data - Data to generate csv for.
 * @param {CSVOptions} options - Options to configure csv export.
 * @returns {string} The csv data string.
 */
function generateCSV(data, options) {
  /** @type {CSVOptions} */
  const opts = { ...defaultOptions, ...options };

  /** @type {string[]} */
  const rows = [];

  if (opts.msExcelCompatible) {
    // append MS Excel compatibility header
    rows.push(`sep=${opts.delimiter}`);
  }

  // append header line
  rows.push("time,method,url,status,time,request-size,response-size,http-version,remote-address");

  // append data rows
  for (let i = 0; i < data.log.entries.length; i++) {
    const entry = data.log.entries[i];

    let row = "";
    row += `"${entry.startedDateTime}"`;
    row += `,"${entry.request.method.toUpperCase()}"`;
    row += `,"${entry.request.url}"`;
    row += `,"${entry.response.status}"`;
    row += `,"${entry.time}"`;
    row += `,"${entry.custom.request.totalSize}"`; // TODO: new prop
    row += `,"${entry.custom.response.totalSize}"`; // TODO: new prop
    row += `,"${entry.request.httpVersion}"`;
    row += `,"${entry.serverIPAddress}"`;

    rows.push(row);
  }

  return rows.join("\n");
}

export default generateCSV;
