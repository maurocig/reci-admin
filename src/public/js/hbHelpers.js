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
  isOdd: function (i) {
    return i % 2;
  },
  eq: function (a, b) {
    return a === b;
  },
  neq: function (a, b) {
    return a !== b;
  },
  json: function (context) {
    return JSON.stringify(context);
  },
  isPlateNumber: function (serialNumber) {
    const plateNumberRegex = /^[A-Za-z]{3}\d{4}$/;
    const brasilPlateNumberRegex = /^[A-Za-z]{1}\d{6}$/;
    const matches =
      plateNumberRegex.test(serialNumber) || brasilPlateNumberRegex.test(serialNumber);
    return matches;
  },
  isInWarranty: function (warrantyDate) {
    const today = moment().tz('America/Montevideo').format('YYYY/MM/DD');
    const warrantyEndDate = moment(warrantyDate).tz('America/Montevideo').format('YYYY/MM/DD');
    const isWarrantyActive = moment(today).isBefore(warrantyEndDate);
    return isWarrantyActive;
  },
  and: function (v1, v2) {
    return v1 && v2;
  },
  not: function (v) {
    return !v;
  },
  isEmptyOrUndefined: function (value) {
    return value === undefined || value === null || value.length === 0;
  },
  or: function (v1, v2) {
    return v1 || v2;
  },
  pluralize: function (length, singular, plural) {
    return length === 1 ? singular : plural;
  },
};
