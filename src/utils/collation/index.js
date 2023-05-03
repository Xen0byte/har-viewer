import filterBy from "./filtering.js";
import groupBy from "./grouping.js";
import sortBy from "./sorting.js";

/**
 * Apply all filters and return a new object.
 * @param {HttpArchive.Entry[]} data - Data to filter.
 * @param {object} filters - Filter configuration.
 * @param {boolean} onlySortAndGroup - do only sort and group data.
 * @returns {HttpArchive.Entry[]} - Filtered data.
 */
export default function applyCollation(data, filters, onlySortAndGroup) {
  const clone = [...data];

  if (filters.filter && !onlySortAndGroup) {
    filterBy(clone, filters.filter);
  }

  if (filters.sortBy) {
    sortBy(clone, filters.sortBy);
  }

  if (filters.groupBy) {
    groupBy(clone, filters.groupBy);
  } else {
    groupBy(clone);
  }

  return clone;
}
