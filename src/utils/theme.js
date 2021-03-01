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

export { switchTheme, getSystemTheme };
export default {
  switchTheme,
  getSystemTheme,
};
