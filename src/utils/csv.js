/* eslint-disable import/prefer-default-export */

export const toCSV = data => {
  let csv = "time,method,url,status,time,request-size,response-size,http-version,remote-address";

  for (let i = 0; i < data.log.entries.length; i++) {
    const entry = data.log.entries[i];

    csv += "\n";
    csv += `"${entry.startedDateTime}"`;
    csv += `"${entry.request.method.toUpperCase()}"`;
    csv += `,"${entry.request.url}"`;
    csv += `,"${entry.response.status}"`;
    csv += `,"${entry.time}"`;
    csv += `,"${entry.custom.request.totalSize}"`;
    csv += `,"${entry.custom.response.totalSize}"`;
    csv += `,"${entry.request.httpVersion}"`;
    csv += `,"${entry.serverIPAddress}"`;
  }

  return csv;
};
