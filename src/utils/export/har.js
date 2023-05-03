/* global HttpArchive */

/**
 * Generate a har json from given data.
 * @param {HttpArchive} data - Data to generate csv for.
 * @returns {string} The har json data string.
 */
function generateHar(data) {
  /** @type {HttpArchive} */
  const clone = { ...data };

  for (let i = 0; i < clone.log.entries.length; i++) {
    delete clone.log.entries[i]._harviewer;
  }

  return JSON.stringify(clone);
}

export default generateHar;
