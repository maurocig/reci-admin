const moment = require('moment-timezone');

module.exports = {
  formatDate: function (date) {
    // return date ? new Date(date).toLocaleDateString('en-US') : '';
    formattedDate = moment(date).format('DD/MM/YYYY');
    return formattedDate;
  },
  formatDateValue: function (date) {
    formattedDate = moment(date).format('YYYY/MM/DD').replaceAll('/', '-');
    console.log(formattedDate);
    return formattedDate;
  },
};
