/* eslint-disable import/prefer-default-export */

/**
 * Finds all unique property values in an array of objects.
 *
 * @param arr {Object[]} - The data array.
 * @param cb {function} - Lamda returning the property to reduce on.
 *
 * @returns {Array} An array of unique reducted property values.
 */
export function uniqueArrayByProperty(arr, cb) {
  return arr.reduce((prev, item) => {
    const v = cb(item);

    if (!prev.includes(v) && v !== undefined) {
      prev.push(v);
    }

    return prev;
  }, []);
}

/**
 * Compare two values.
 *
 * @param a {string|number} - The first value to compare.
 * @param b {string|number} - The second value to compare.
 *
 * @returns {number}
 *   <ul>
 *      <li>0 if a is equal to b.</li>
 *      <li>-1 if a is less than b.</li>
 *      <li>1 if a is greater than b.</li>
 *   </ul>
 */
export function compare(a, b) {
  if (a < b) {
    return -1;
  }

  return a > b ? 1 : 0;
}
