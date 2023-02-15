const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(src, alt, sizes) {
  const metadata = await Image(src, {
    widths: [375, 650, 1300],
    formats: ["webp", "jpeg", "svg"],
    outputDir: "./_site/public/img/",
    urlPath: "/img",
  });

  let imageAttributes = {
    alt,
    sizes: sizes || "(max-width: 768px) calc(100vw - 1.5rem), 646px",
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
};
