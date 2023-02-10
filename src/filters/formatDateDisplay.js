const { format } = require("date-fns");
const { de } = require("date-fns/locale");

module.exports = function formatDateDisplay(d) {
  return format(d, "d. MMMM, yyyy", { locale: de });
};
