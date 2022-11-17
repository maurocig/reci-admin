const HTTP_STATUS = require('../constants/api.constants');
const { ClientsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');
const getDate = require('../utils/timezone');

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
        // dateCreated: getDate(),
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
