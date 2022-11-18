const HTTP_STATUS = require('../constants/api.constants');
const { ClientsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');
const getDate = require('../utils/timezone');

const clientsDao = new ClientsDao();

class ClientsController {
  async getClients(req, res, next) {
    try {
      const clients = await clientsDao.getAll();

      // const response = successResponse(clients);
      // res.status(HTTP_STATUS.OK).json(response);

      res.status(HTTP_STATUS.OK).render('pages/clients', { clients: clients });
    } catch (error) {
      next(error);
    }
  }

  async getClientsById(req, res, next) {
    const { id } = req.params;
    try {
      const client = await clientsDao.getById(id);

      // const response = successResponse(client);
      // res.status(HTTP_STATUS.OK).json(response);

      console.log(client);

      res
        .status(HTTP_STATUS.OK)
        .render('pages/clients/show', { client: client });
    } catch (error) {
      next(error);
    }
  }

  async saveClient(req, res, next) {
    try {
      const { name, email, refUnits, phone, createdAt, updatedAt } = req.body;
      const phoneNumber = parseInt(phone);
      const client = {
        name,
        email,
        refUnits,
        phone: phoneNumber,
        createdAt,
        updatedAt,
      };
      const newClientId = await clientsDao.save(client);

      const response = {
        client: client,
        id: newClientId,
        message: 'Se creó un nuevo cliente.',
      };
      console.log(response);

      res.render('pages/success', { response });
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    const { id } = req.params;
    try {
      const client = {
        dateUpdated: getDate(),
        ...req.body,
      };
      const updatedClient = await clientsDao.update(id, client);
      const response = successResponse(updatedClient);
      res.status(HTTP_STATUS.OK).json(response);
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
}

module.exports = new ClientsController();
