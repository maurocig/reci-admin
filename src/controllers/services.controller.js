const HTTP_STATUS = require('../constants/api.constants');
const { ServicesDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const servicesDao = new ServicesDao();

class ServicesController {
  async getServices(req, res, next) {
    try {
      const services = await servicesDao.getAll();

      // json
      const response = successResponse(services);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getServicesById(req, res, next) {
    const { id } = req.params;
    try {
      const service = await servicesDao.getById(id);

      // json
      const response = successResponse(service);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async saveService(req, res, next) {
    try {
      const {
        orderNumber,
        parts,
        fixes,
        price,
        refUnit,
        client,
        clientName,
        serviceDate,
      } = req.body;

      const service = {};
      const newService = await servicesDao.save(service);

      // json
      const response = successResponse(newService);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateService(req, res, next) {
    const { id } = req.params;
    try {
      const updatedService = await servicesDao.update(id, req.body);
      const response = successResponse(updatedService);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    const { id } = req.params;
    try {
      const deletedService = await servicesDao.delete(id);
      const response = successResponse(deletedService);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServicesController();
