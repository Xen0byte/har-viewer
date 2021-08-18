/* eslint-disable import/prefer-default-export */

/**
 * Order indicators for status type sorting.
 *
 * @type {{
 *   Unknown: number,
 *   Redirection: number,
 *   "Server Error": number,
 *   Informational: number,
 *   "Client Error": number,
 *   Success: number
 * }}
 */
export const statusTypeOrder = {
  Informational: 0,
  Success: 1,
  Redirection: 2,
  "Client Error": 3,
  "Server Error": 4,
  Unknown: 5,
};

/**
 * Order indicators for method sorting.
 *
 * @type {{
 *   TRACE: number,
 *   HEAD: number,
 *   DELETE: number,
 *   POST: number,
 *   GET: number,
 *   CONNECT: number,
 *   OPTIONS: number,
 *   PATCH: number,
 *   PUT: number
 * }}
 */
export const methodOrder = {
  GET: 0,
  POST: 1,
  PATCH: 2,
  PUT: 3,
  DELETE: 4,
  OPTIONS: 5,
  HEAD: 6,
  CONNECT: 7,
  TRACE: 8,
};
