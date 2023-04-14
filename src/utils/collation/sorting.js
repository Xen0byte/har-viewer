import { compare } from "../helpers.js";

/**
 * Sort an array of har entries.
 *
 * @param {HttpArchive.Entry[]} arr - The har entries to sort.
 * @param {string} [prop] - THe name of the propery to sort by (leave empty to unsort).
 */
export default function sortBy(arr, prop) {
  let sortFunc;

  switch (prop) {
    case "status":
      sortFunc = (a, b) => compare(a.response.status, b.response.status);
      break;
    case "status-reverse":
      sortFunc = (a, b) => compare(b.response.status, a.response.status);
      break;
    case "timing":
      sortFunc = (a, b) => compare(a.time, b.time);
      break;
    case "timing-reverse":
      sortFunc = (a, b) => compare(b.time, a.time);
      break;
    case "reqSize":
      sortFunc = (a, b) => compare(a._harviewer.request.totalSize, b._harviewer.request.totalSize);
      break;
    case "reqSize-reverse":
      sortFunc = (a, b) => compare(b._harviewer.request.totalSize, a._harviewer.request.totalSize);
      break;
    case "resSize":
      sortFunc = (a, b) => compare(a._harviewer.response.totalSize, b._harviewer.response.totalSize);
      break;
    case "resSize-reverse":
      sortFunc = (a, b) => compare(b._harviewer.response.totalSize, a._harviewer.response.totalSize);
      break;
    default:
      sortFunc = (a, b) => compare(a._harviewer.id, b._harviewer.id);
      break;
  }

  arr.sort(sortFunc);
}
