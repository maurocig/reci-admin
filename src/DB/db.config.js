const envConfig = require('../config');

const DB_USER = 'admin';
const DB_NAME = process.env.NODE_ENV === 'production' ? 'main' : 'dev';

module.exports = {
  mongodb: {
    uri: `mongodb+srv://${DB_USER}:${envConfig.DB_PASSWORD}@cluster0.foebgmf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  },
  DB_NAME,
  DB_USER,
};
