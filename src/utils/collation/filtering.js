/* eslint-disable no-continue */

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
export default function filterBy(arr, filter) {
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

      const include = includes.includes(arr[i]._harviewer.resourceType.toLowerCase());
      const exclude = excludes.includes(arr[i]._harviewer.resourceType.toLowerCase());

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
