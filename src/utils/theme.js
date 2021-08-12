/**
 * Switch the currently active theme.
 *
 * @param {string} theme The theme to switch to.
 */
const switchTheme = theme => {
  document.querySelector("html").dataset.theme = theme;
};

/**
 * Gets the preferred system theme.
 *
 * @returns {string}
 */
const getSystemTheme = () => window.localStorage.getItem("theme")
  || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark" : "light");

/**
 * Determines whether the app is running in standalone mode or not.
 * @returns {boolean}
 */
const isPWA = () => window.matchMedia("(display-mode: standalone)").matches
  || (window.navigator.standalone)
  || document.referrer.includes("android-app://");

export { switchTheme, getSystemTheme, isPWA };
export default {
  switchTheme,
  getSystemTheme,
  isPWA,
};
