const HTTP_STATUS = require('../constants/api.constants');
const { ClientsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const clientsDao = new ClientsDao();

class ClientsController {
  async getClients(req, res, next) {
    try {
      const clients = await clientsDao.getAll();
      const response = successResponse(clients);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getClientsById(req, res, next) {
    const { id } = req.params;
    try {
      const client = await clientsDao.getById(id);
      const response = successResponse(client);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async saveClient(req, res, next) {
    try {
      const client = {
        timestamp: new Date(),
        ...req.body,
      };
      const newClient = await clientsDao.save(client);
      const response = successResponse(newClient);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    const { id } = req.params;
    try {
      const updatedClient = await clientsDao.update(id, req.body);
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
}

module.exports = new ClientsController();
