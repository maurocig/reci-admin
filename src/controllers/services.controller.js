const HTTP_STATUS = require('../constants/api.constants');
const { ServicesDao } = require('../models/daos/app.daos');
const { RefUnitsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const servicesDao = new ServicesDao();
const refUnitsDao = new RefUnitsDao();

class ServicesController {
  async getServices(req, res, next) {
    try {
      const services = await servicesDao.getAll();

      // JSON
      const response = successResponse(services);
      res.status(HTTP_STATUS.OK).json(response);

      // res.status(HTTP_STATUS.OK).render('pages/services/', { services });
    } catch (error) {
      next(error);
    }
  }

  async getServicesById(req, res, next) {
    const { id } = req.params;
    try {
      const service = await servicesDao.getById(id);
      const clientName = await servicesDao.getClientName(id);

      // json
      const response = successResponse(service);
      /////////////////////
      console.log(`Nombre del cliente: ${clientName}`);
      /////////////////////
      res.status(HTTP_STATUS.OK).json(response);

      // res
      //   .status(HTTP_STATUS.OK)
      //   .render('pages/services/show', { service, clientName });
    } catch (error) {
      next(error);
    }
  }

  async saveService(req, res, next) {
    console.log('reached saveService controller.');

    console.log(req.body);
    const {
      client,
      refUnit,
      orderNumber,
      hours,
      serviceDate,
      parts,
      fixes,
      // hasWarranty,
    } = req.body;

    try {
      const service = {
        client,
        refUnit,
        orderNumber,
        serviceDate,
        hours,
        parts,
        fixes,
        // hasWarranty,
      };

      const newServiceId = await servicesDao.save(service);
      console.log('id', newServiceId);

      // Add Service to refUnit.services array.
      const addedService = await refUnitsDao.addService(service.refUnit, newServiceId);
      console.log(addedService);

      res.status(200).send(newServiceId);
    } catch (error) {
      next(error);
    }
  }

  async newServiceForm(req, res, next) {
    try {
      const { refUnitId } = req.params;
      const refUnit = await refUnitsDao.getByIdAndPopulate(refUnitId);
      const scripts = [
        { script: '/js/newServiceFormHandler.js' },
        { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      ];
      res.render('pages/services/new', { refUnit, scripts });
    } catch (error) {
      console.log(error);
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
