const HTTP_STATUS = require('../constants/api.constants');
const { ClientsDao, RefUnitsDao, ServicesDao, BodyKitsDao } = require('../models/daos/app.daos');
const ClientsMongoDao = require('../models/daos/clients.mongo.dao');
const { successResponse } = require('../utils/api.utils');
const getDate = require('../utils/timezone');

const clientsDao = new ClientsDao();
const refUnitsDao = new RefUnitsDao();
const bodyKitsDao = new BodyKitsDao();
const servicesDao = new ServicesDao();

class ClientsController {
  async getClients(req, res, next) {
    const sortQuery = req.query.sort || null;
    let sort;
    let addFields;
    try {
      if (sortQuery === 'name' || !sortQuery) {
        sort = { name: 1 };
      } else if (sortQuery === 'client-number') {
        sort = { clientNumber: 1 };
      } else if (sortQuery === 'refUnits-length') {
        addFields = { refUnitsLength: { $size: '$refUnits' } };
        sort = { refUnitsLength: -1 };
      }
      const clients = await clientsDao.getAllAggregate({}, sort, addFields);
      res.status(HTTP_STATUS.OK).render('pages/clients', { clients });
    } catch (error) {
      next(error);
    }
  }

  async getClientsById(req, res, next) {
    const { id } = req.params;
    try {
      const client = await clientsDao.getById(id);
      const refUnits = await refUnitsDao.getAll({ client: id });
      const bodyKits = await bodyKitsDao.getAll({ client: id });
      const services = await servicesDao.getAllWithRefUnits({ client: id });

      res
        .status(HTTP_STATUS.OK)
        .render('pages/clients/show', { client, refUnits, bodyKits, services });
    } catch (error) {
      next(error);
    }
  }

  async editClientsById(req, res, next) {
    const { id } = req.params;
    try {
      const client = await clientsDao.getById(id);
      res.status(HTTP_STATUS.OK).render('pages/clients/edit', { client: client });
      res;
    } catch (error) {
      next(error);
    }
  }

  async getClientsForm(req, res, next) {
    try {
      const clients = await clientsDao.getAll();
      const clientNumber = clients.length + 1;
      res.render('pages/clients/new', { clientNumber });
    } catch (error) {
      next(error);
    }
  }

  async saveClient(req, res, next) {
    try {
      const {
        name,
        email,
        refUnits,
        phone,
        createdAt,
        updatedAt,
        clientNumber,
        contactPerson,
        brandName,
      } = req.body;

      const phoneNumber = phone ? parseInt(phone) : null;

      const client = {
        name,
        email,
        refUnits,
        phone: phoneNumber,
        clientNumber: +clientNumber,
        contactPerson: contactPerson || null,
        brandName,
        createdAt,
        updatedAt,
      };

      const newClientId = await clientsDao.save(client);
      res.redirect(`/clientes/${newClientId}`);

      // res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    const { id } = req.params;
    try {
      const client = {
        ...req.body,
      };
      const updatedClient = await clientsDao.update(id, client);
      res.redirect(`/clientes/${id}`);
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    const { id } = req.params;
    try {
      const deletedClient = await clientsDao.delete(id);
      const response = successResponse(deletedClient);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async addRefUnitToClient(req, res, next) {
    const { clientId, refUnitId } = req.params;
    try {
      const updatedClient = await clientsDao.addRefUnit(clientId, refUnitId);
      const response = successResponse(updatedClient);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeRefUnitFromClient(req, res, next) {
    const { clientId, refUnitId } = req.params;
    try {
      const updatedClient = await clientsDao.removeRefUnit(clientId, refUnitId);
      const response = successResponse(updatedClient);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async searchClient(req, res, next) {
    let query = req.query.q;
    try {
      if (!query) {
        const clients = await clientsDao.getAllSorted();
        res.status(HTTP_STATUS.OK).render('pages/clients', { clients });
      } else {
        const clients = await clientsDao.find({ $text: { $search: query } });
        res.status(HTTP_STATUS.OK).render('pages/clients', { clients });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new ClientsController();
