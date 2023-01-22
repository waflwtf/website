const path = require("path");

module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
    "postcss-hash": {
      algorithm: "sha256",
      trim: 20,
      manifest: path.resolve(__dirname, "src/site/_data/stylesManifest.json"),
    },
  },
};
