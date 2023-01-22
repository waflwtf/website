const UserConfig = require("@11ty/eleventy/src/UserConfig");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyPluginRss = require("@11ty/eleventy-plugin-rss");
const escape = require("lodash/escape");
const contentBox = require("./src/shortcodes/contentBox.js");

/** @param {UserConfig} config */
module.exports = function (config) {
  // add navigation support
  config.addPlugin(eleventyNavigationPlugin);
  // add multiple nunjucks filters for RSS/Atom feeds
  config.addPlugin(eleventyPluginRss);

  config.addPassthroughCopy("./src/site/scripts");
  config.addPassthroughCopy("./src/site/img");

  config.addPairedShortcode("contentBox", contentBox);

  // Escape characters for XML feed
  config.addFilter("xmlEscape", (value) => {
    return escape(value);
  });

  config.addFilter("required", (d) => {
    if (d == undefined) {
      throw new Error("Data is undefined but is marked as required.");
    }

    return d;
  });

  const getObjectValueForPath = (obj, path) =>
    path.split(".").reduce((a, v) => (a ? a[v] : undefined), obj);

  config.addFilter(
    "ensureUniqueInCollection",
    /**
     *
     * @param {any} value
     * @param {string} path
     * @param {object[]} collection
     * @returns
     */
    (value, path, collection) => {
      if (!collection || !collection.length) {
        throw new Error(
          "Collection is empty in ensureUniqueInCollection filter."
        );
      }

      if (!path || path.trim() === "") {
        throw new Error("Path is empty in ensureUniqueInCollection filter.");
      }

      const items = collection.filter(
        (item) => getObjectValueForPath(item, path) === value
      );

      if (items.length > 1) {
        throw new Error(
          `Found value '${value}' for path '${path}' ${items.length} times in collection but expected only one.`
        );
      }

      return value;
    }
  );

  return {
    dir: {
      input: "src/site",
      includes: "_includes",
      output: "_site",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
