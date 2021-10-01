/* eslint-disable import/prefer-default-export,no-continue */

import { compare } from "./helpers";
import { methodOrder, statusTypeOrder } from "./constants";

/**
 * Check whether a number is included in a range or not.
 *
 * @param {number} num - The number to test.
 * @param {number[]} ranges - Array of ranger (<code>[start, end]</code>).
 * @returns {boolean} A boolean indicating whether num is included in the ranges.
 */
function isInRanges(num, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    if (num >= ranges[i][0] && num <= ranges[i][1]) {
      return true;
    }
  }

  return false;
}

/**
 * Check whether a string matches any pattern in a array of patterns.
 *
 * @param {string} str - The string to test.
 * @param {string[]} patterns - An array of regex patterns.
 * @returns {boolean} A boolean indicating whether a string matches any pattern in a array of patterns.
 */
function regexMatch(str, patterns) {
  for (let i = 0; i < patterns.length; i++) {
    const match = new RegExp(`^${patterns[i].replace(/\*/g, ".*")}$`).test(str);

    if (match) {
      return true;
    }
  }

  return false;
}

/**
 * Simple parse in- and excludes from filter string.
 *
 * @param {string} filter - The filter string to parse.
 * @returns {{
 *   excludes,
 *   includes
 * }} The parsed in- and excludes.
 */
function parseInAndExcludes(filter) {
  const parts = filter.split(",");

  return {
    includes: parts.filter(m => !m.startsWith("!")),
    excludes: parts.filter(m => m.startsWith("!"))
      .map(m => m.replace("!", "")),
  };
}

/**
 * Filter an array of har entries.
 *
 * @param {object[]} arr - The har entries to filter.
 * @param {object} filter - The filter to apply.
 */
function filterBy(arr, filter) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (filter.methods) {
      const { includes, excludes } = parseInAndExcludes(filter.methods);

      const include = includes.includes(arr[i].request.method.toLowerCase());
      const exclude = excludes.includes(arr[i].request.method.toLowerCase());

      if (exclude) {
        arr.splice(i, 1);
        continue;
      }

      if (includes.length !== 0 && !include) {
        arr.splice(i, 1);
        continue;
      }
    }

    if (filter.status) {
      const status = filter.status.split(",");
      const statusIncludes = status.filter(m => !m.startsWith("!") && !m.includes("-"));
      const statusIncludeRanges = status.filter(m => !m.startsWith("!") && m.includes("-"))
        .map(m => {
          const parts = m.split("-");
          return [Number(parts[0]), Number(parts[1])];
        });
      const statusExcludes = status.filter(m => m.startsWith("!") && !m.includes("-"))
        .map(m => m.replace("!", ""));
      const statusExcludeRanges = status.filter(m => m.startsWith("!") && m.includes("-"))
        .map(m => {
          const parts = m.replace("!", "")
            .split("-");
          return [Number(parts[0]), Number(parts[1])];
        });

      const include = statusIncludes.includes(arr[i].response.status.toString())
        || isInRanges(arr[i].response.status, statusIncludeRanges);
      const exclude = statusExcludes.includes(arr[i].response.status.toString())
        || isInRanges(arr[i].response.status, statusExcludeRanges);

      if (exclude) {
        arr.splice(i, 1);
        continue;
      }

      if ((statusIncludes.length !== 0 || statusIncludeRanges.length) !== 0 && !include) {
        arr.splice(i, 1);
        continue;
      }
    }

    if (filter.resType) {
      const { includes, excludes } = parseInAndExcludes(filter.resType);

      const include = includes.includes(arr[i].custom.resourceType.toLowerCase());
      const exclude = excludes.includes(arr[i].custom.resourceType.toLowerCase());

      if (exclude) {
        arr.splice(i, 1);
        continue;
      }

      if (includes.length !== 0 && !include) {
        arr.splice(i, 1);
        continue;
      }
    }

    if (filter.domains) {
      const { includes, excludes } = parseInAndExcludes(filter.domains);

      const include = includes.includes((new URL(arr[i].request.url)).hostname.toLowerCase())
        || regexMatch((new URL(arr[i].request.url)).hostname.toLowerCase(), includes);
      const exclude = excludes.includes((new URL(arr[i].request.url)).hostname.toLowerCase())
        || regexMatch((new URL(arr[i].request.url)).hostname.toLowerCase(), excludes);

      if (exclude) {
        arr.splice(i, 1);
        continue;
      }

      if (includes.length !== 0 && !include) {
        arr.splice(i, 1);
        continue;
      }
    }
  }
}

/**
 * Sort an array of har entries.
 *
 * @param {object[]} arr - The har entries to sort.
 * @param {string} [prop] - THe name of the propery to sort by (leave empty to unsort).
 */
function sortBy(arr, prop) {
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
      sortFunc = (a, b) => compare(a.custom.request.totalSize, b.custom.request.totalSize);
      break;
    case "reqSize-reverse":
      sortFunc = (a, b) => compare(b.custom.request.totalSize, a.custom.request.totalSize);
      break;
    case "resSize":
      sortFunc = (a, b) => compare(a.custom.response.totalSize, b.custom.response.totalSize);
      break;
    case "resSize-reverse":
      sortFunc = (a, b) => compare(b.custom.response.totalSize, a.custom.response.totalSize);
      break;
    default:
      sortFunc = (a, b) => compare(a.custom.id, b.custom.id);
      break;
  }

  arr.sort(sortFunc);
}

/**
 * Group an array of har entries.
 *
 * @param {object[]} arr - The har entries to group.
 * @param {string} [prop] - THe name of the propery to group by (leave empty to ungroup).
 */
function groupBy(arr, prop) {
  if (!prop) {
    for (let i = 0; i < arr.length; i++) {
      // eslint-disable-next-line no-param-reassign
      delete arr[i].custom.group;
    }

    return;
  }

  for (let i = 0; i < arr.length; i++) {
    let group = "";

    if (prop === "method") {
      group = arr[i].request.method;
    } else if (prop === "status") {
      if (arr[i].response.status === 0) {
        // eslint-disable-next-line no-underscore-dangle
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
      group = arr[i].custom.resourceType;
    } else if (prop === "domain") {
      group = (new URL(arr[i].request.url)).hostname;
    }

    // eslint-disable-next-line no-param-reassign
    arr[i].custom.group = group;
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

/**
 * Apply all filters and return a new object.
 *
 * @param {object[]} data - Data to filter.
 * @param {object} filters - Filter configuration.
 * @param {boolean} onlySortAndGroup - do only sort and group data.
 * @returns {object[]} - Filtered data.
 */
function applyFilter(data, filters, onlySortAndGroup) {
  const clone = [...data];

  if (!filters.filter || onlySortAndGroup) {
    if (filters.sortBy) {
      sortBy(clone, filters.sortBy);
    } else {
      sortBy(clone);
    }

    if (filters.groupBy) {
      groupBy(clone, filters.groupBy);
    } else {
      groupBy(clone);
    }

    return clone;
  }

  filterBy(clone, filters.filter);

  if (filters.sortBy) {
    sortBy(clone, filters.sortBy);
  }

  if (filters.groupBy) {
    groupBy(clone, filters.groupBy);
  }

  return clone;
}

export default applyFilter;
