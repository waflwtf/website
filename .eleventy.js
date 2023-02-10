const UserConfig = require("@11ty/eleventy/src/UserConfig");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyPluginRss = require("@11ty/eleventy-plugin-rss");
const escape = require("lodash/escape");
const contentBox = require("./src/shortcodes/contentBox.js");
const formatDateDisplay = require("./src/filters/formatDateDisplay.js");
const formatDateISO = require("./src/filters/formatDateISO.js");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const path = require("path");
const vue = require("@vitejs/plugin-vue").default;
const svgLoader = require("vite-svg-loader").default;

/** @param {UserConfig} config */
module.exports = function (config) {
  // add navigation support
  config.addPlugin(eleventyNavigationPlugin);
  // add multiple nunjucks filters for RSS/Atom feeds
  config.addPlugin(eleventyPluginRss);
  config.addPlugin(pluginWebc, {
    components: "./src/site/_includes/components/**/*.webc",
  });
  config.addPlugin(EleventyRenderPlugin);
  config.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite", // Default name of the temp folder

    // Vite options (equal to vite.config.js inside project root)
    /** @type {import('vite').UserConfig} */
    viteOptions: {
      publicDir: "public",
      clearScreen: false,
      appType: "mpa",
      server: {
        mode: "development",
        middlewareMode: true,
      },
      plugins: [vue(), svgLoader()],
      assetsInclude: ["**/*.xml", "**/*.txt"],
      build: {
        mode: "production",
        assetsInlineLimit: 0,
        rollupOptions: {
          output: {
            assetFileNames(chunkInfo) {
              let ext = path.extname(chunkInfo.name);

              if (/png|svg|jpg|jpeg|webp|ico/i.test(ext)) {
                return `img/[name][extname]`;
              } else if (/mp4|webm/i.test(ext)) {
                ext = "videos";
              }

              return `assets/${ext}/[name].[hash][extname]`;
            },

            chunkFileNames: "assets/scripts/[name].[hash].js",
            entryFileNames: "assets/scripts/[name].[hash].js",
          },
        },
      },
    },
  });

  config.addPassthroughCopy("./public");
  config.addPassthroughCopy("./src/site/assets");
  config.addPassthroughCopy("./src/site/scripts");
  config.addPassthroughCopy("./src/site/styles");

  config.addPairedShortcode("contentBox", contentBox);

  // Escape characters for XML feed
  config.addFilter("xmlEscape", (value) => {
    return escape(value);
  });
  config.addFilter("formatDateDisplay", formatDateDisplay);
  config.addFilter("formatDateISO", formatDateISO);

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
    templateFormats: ["njk", "md", "11ty.js", "webc"],
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
