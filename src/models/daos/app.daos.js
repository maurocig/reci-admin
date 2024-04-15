const envConfig = require('../../config');

let ClientsDao;
let RefUnitsDao;
let ServicesDao;
let BodyKitsDao;
let UsersDao;

switch (envConfig.DATASOURCE) {
  case 'mongo':
    ClientsDao = require('./clients.mongo.dao');
    RefUnitsDao = require('./refUnits.mongo.dao');
    BodyKitsDao = require('./bodyKits.mongo.dao');
    ServicesDao = require('./services.mongo.dao');
    BodykitServicesDao = require('./bodykitServices.mongo.dao');
    UsersDao = require('./users.mongo.dao');
    break;

  default:
    throw new Error('Invalid Datasource');
}

module.exports = {
  ClientsDao,
  RefUnitsDao,
  ServicesDao,
  BodyKitsDao,
  BodykitServicesDao,
};
