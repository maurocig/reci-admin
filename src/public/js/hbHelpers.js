const moment = require('moment-timezone');

module.exports = {
  formatDate: function (date) {
    formattedDate = moment(date).format('DD/MM/YYYY').replaceAll('/', '-');
    return formattedDate;
  },
  formatDateValue: function (date) {
    formattedDate = moment(date).format('YYYY/MM/DD').replaceAll('/', '-');
    return formattedDate;
  },
  addNumber: function (i, n) {
    return i + parseInt(n);
  },
};
