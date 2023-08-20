const moment = require('moment-timezone');

const HTTP_STATUS = require('../constants/api.constants');
const { ServicesDao } = require('../models/daos/app.daos');
const { RefUnitsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const servicesDao = new ServicesDao();
const refUnitsDao = new RefUnitsDao();

class ServicesController {
  async getServices(req, res, next) {
    const page = req.query.p || 0;

    try {
      const services = await servicesDao.getAllAndPopulate(page);
      const scripts = [{ script: '/js/formatDate.js' }];

      res.render('pages/services/index.hbs', { services, scripts });
    } catch (error) {
      next(error);
    }
  }

  async getServicesById(req, res, next) {
    const { id } = req.params;
    try {
      const service = await servicesDao.getByIdAndPopulate(id);

      res.status(HTTP_STATUS.OK).render('pages/services/show', { service });
    } catch (error) {
      next(error);
    }
  }

  async saveService(req, res, next) {
    const { client, refUnit, orderNumber, serviceDate, hours, ticket, isInWarranty, parts, fixes } =
      req.body;

    const formattedServiceDate = moment(serviceDate).tz('GMT').format('YYYY/MM/DD');
    const isInWarrantyBoolean = Boolean(isInWarranty);
    const parsedHours = +hours;
    const parsedOrderNumber = +orderNumber;

    try {
      const service = {
        client,
        refUnit,
        orderNumber: parsedOrderNumber,
        serviceDate: formattedServiceDate,
        hours: parsedHours,
        ticket,
        isInWarranty: isInWarrantyBoolean,
        parts,
        fixes,
      };

      const newServiceId = await servicesDao.save(service);

      // Add Service to refUnit.services array.
      const addedService = await refUnitsDao.addService(service.refUnit, newServiceId);

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

  async editServiceForm(req, res, next) {
    const { serviceId } = req.params;
    const service = await servicesDao.getByIdAndPopulate(serviceId);
    const scripts = [
      { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      { script: '/js/editServiceFormHandler.js' },
      { script: '/js/deleteServiceHandler.js' },
      { script: '/js/formatDate.js' },
    ];
    res.render('pages/services/edit', { service, scripts });
  }

  async updateService(req, res, next) {
    const { id } = req.params;
    const { orderNumber, serviceDate, hours, ticket, isInWarranty, parts, fixes } = req.body;

    const oldService = await servicesDao.getById(id);
    const { client, refUnit } = oldService;

    const formattedServiceDate = moment(serviceDate).tz('GMT').format('YYYY/MM/DD');
    const isInWarrantyBoolean = Boolean(isInWarranty);
    const parsedHours = +hours;
    const parsedOrderNumber = +orderNumber;

    try {
      const updatedService = {
        client,
        refUnit,
        orderNumber: parsedOrderNumber,
        serviceDate: formattedServiceDate,
        hours: parsedHours,
        ticket,
        isInWarranty: isInWarrantyBoolean,
        parts,
        fixes,
      };

      const response = await servicesDao.update(id, updatedService);

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    const { id } = req.params;
    try {
      const service = await servicesDao.getById(id);
      if (service.refUnit) {
        await refUnitsDao.removeService(service.refUnit, id);
      }
      const deletedService = await servicesDao.delete(id);
      const response = successResponse(deletedService);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async searchService(req, res, next) {
    let query = req.query.q;
    try {
      if (!query) {
        const services = await servicesDao.getAllAndPopulate();
        res.status(HTTP_STATUS.OK).render('pages/services', { services });
      } else {
        const services = await servicesDao.findNumber({ orderNumber: { $eq: +query } }, 'refUnit');
        res.status(HTTP_STATUS.OK).render('pages/services', { services });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new ServicesController();
