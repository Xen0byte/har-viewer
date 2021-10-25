import { methodOrder, statusTypeOrder } from "../constants";
import { compare } from "../helpers";

/**
 * Group an array of har entries.
 *
 * @param {HttpArchive.Entry[]} arr - The har entries to group.
 * @param {string} [prop] - THe name of the propery to group by (leave empty to ungroup).
 */
export default function groupBy(arr, prop) {
  if (!prop) {
    for (let i = 0; i < arr.length; i++) {
      // eslint-disable-next-line no-param-reassign
      delete arr[i]._harviewer.group;
    }

    return;
  }

  for (let i = 0; i < arr.length; i++) {
    let group = "";

    if (prop === "method") {
      group = arr[i].request.method;
    } else if (prop === "status") {
      if (arr[i].response.status === 0) {
        group = arr[i].response.statusText || arr[i].response._error || "Unknown";
      } else {
        group = arr[i].response.status;
      }
    } else if (prop === "status-type") {
      if (arr[i].response.status > 0 && arr[i].response.status < 200) {
        group = "Informational";
      } else if (arr[i].response.status > 199 && arr[i].response.status < 300) {
        group = "Success";
      } else if (arr[i].response.status > 299 && arr[i].response.status < 400) {
        group = "Redirection";
      } else if (arr[i].response.status > 399 && arr[i].response.status < 500) {
        group = "Client Error";
      } else if (arr[i].response.status > 499) {
        group = "Server Error";
      } else {
        group = "Unknown";
      }
    } else if (prop === "resource-type") {
      group = arr[i]._harviewer.resourceType;
    } else if (prop === "domain") {
      group = (new URL(arr[i].request.url)).hostname;
    }

    // eslint-disable-next-line no-param-reassign
    arr[i]._harviewer.group = group;
  }

  let sortFunc;

  if (prop === "resource-type" || prop === "domain" || prop === "status") {
    sortFunc = (a, b) => compare(a.group, b.group);
  } else if (prop === "status-type") {
    sortFunc = (a, b) => compare(statusTypeOrder[a.group], statusTypeOrder[b.group]);
  } else if (prop === "method") {
    sortFunc = (a, b) => compare(methodOrder[a.group], methodOrder[b.group]);
  }

  if (sortFunc) {
    arr.sort(sortFunc);
  }
}
