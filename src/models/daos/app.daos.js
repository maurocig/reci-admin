const envConfig = require('../../config');

let ClientsDao;
let RefUnitsDao;
let ServicesDao;

switch (envConfig.DATASOURCE) {
  case 'mongo':
    ClientsDao = require('./clients.mongo.dao');
    RefUnitsDao = require('./refUnits.mongo.dao');
    ServicesDao = require('./services.mongo.dao');
    break;

  default:
    throw new Error('Invalid Datasource');
}

module.exports = {
  ClientsDao,
  RefUnitsDao,
  ServicesDao,
};
