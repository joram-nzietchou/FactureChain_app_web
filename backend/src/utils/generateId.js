const moment = require('moment');

exports.generateClaimNumber = () => {
  const year = moment().format('YYYY');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RC-${year}-${random}`;
};

exports.generateSubscriberNumber = () => {
  const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `ENEO${random}`;
};