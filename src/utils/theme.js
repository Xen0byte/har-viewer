/* eslint-disable import/prefer-default-export */

/**
 * Switch the currently active theme.
 *
 * @param {string} theme The theme to switch to.
 */
export function switchTheme(theme) {
  document.querySelector("html").dataset.theme = theme;
}

/**
 * Gets the preferred system theme.
 *
 * @returns {string}
 */
export function getSystemTheme() {
  return window.localStorage.getItem("theme")
    || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

/**
 * Determines whether the app is running in standalone mode or not.
 *
 * @returns {boolean}
 */
export function isPWA() {
  return window.matchMedia("(display-mode: standalone)").matches
    || (window.navigator.standalone)
    || document.referrer.includes("android-app://");
}
