const UserConfig = require("@11ty/eleventy/src/UserConfig");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

/** @param {UserConfig} config */
module.exports = function (config) {
  // add navigation support
  config.addPlugin(eleventyNavigationPlugin);

  config.addPassthroughCopy("./src/site/styles");
  config.addPassthroughCopy("./src/site/scripts");
  config.addPassthroughCopy("./src/site/img");

  config.addPairedShortcode(
    "contentBox",
    (content) => `<div class="content-box">${content}</div>`
  );

  return {
    dir: {
      input: "src/site",
      includes: "_includes",
      output: "dist",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
