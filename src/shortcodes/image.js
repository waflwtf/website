const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(src, alt, sizes) {
  const metadata = await Image(src, {
    widths: [640, 770],
    formats: ["webp", "jpeg", "svg"],
    outputDir: "./_site/public/img/",
    urlPath: "/img"
  });

  let imageAttributes = {
    alt,
    sizes: sizes || "100vw",
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
};
