const Image = require("@11ty/eleventy-img");

/**
 * Resizes an image to the given width with the given format.
 * @param {string} src
 * @param {number} width
 * @param {Image.ImageFormat} format
 * @returns Relative url to the image.
 */
module.exports = async function imageResizeFilter(src, width, format) {
  if (!width || width <= 0) {
    throw new Error("image width has to be given and greater than 0");
  }
  if (!format) {
    throw new Error("Format has to be given");
  }

  const metadata = await Image(src, {
    widths: [width],
    formats: [format],
    outputDir: "./_site/public/img/",
    urlPath: "/img",
  });

  return metadata[format][0].url;
};
