const envConfig = require('../config');

module.exports = {
  mongodb: {
    uri: `mongodb+srv://admin:${envConfig.DB_PASSWORD}@cluster0.foebgmf.mongodb.net/?retryWrites=true&w=majority`,
  },
};
