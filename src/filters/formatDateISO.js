const { formatISO } = require("date-fns");

module.exports = function formatDateISO(d) {
  return formatISO(d, { representation: "date" });
};
