const moment = require('moment-timezone');

const HTTP_STATUS = require('../constants/api.constants');
const { ServicesDao } = require('../models/daos/app.daos');
const { RefUnitsDao } = require('../models/daos/app.daos');
const PendingTasksDao = require('../models/daos/pendingTasks.mongo.dao');
const { successResponse } = require('../utils/api.utils');

const servicesDao = new ServicesDao();
const refUnitsDao = new RefUnitsDao();

class ServicesController {
  async getServices(req, res, next) {
    const page = req.query.p || 0;
    const filter = req.query.filter || null;

    let services;
    let documentCount;

    try {
      const years = [2021, 2022, 2023, 2024];
      if (filter && years.includes(+filter)) {
        const start = new Date(+filter, 0, 1);
        const end = new Date(+filter + 1, 0, 1);
        [services, documentCount] = await servicesDao.getAllAndPopulate(page, {
          serviceDate: {
            $gte: start,
            $lt: end,
          },
        });
      } else if (filter && filter === 'no-ticket') {
        [services, documentCount] = await servicesDao.getAllAndPopulate(page, {
          ticket: { $eq: '' },
        });
      } else {
        [services, documentCount] = await servicesDao.getAllAndPopulate(page);
      }

      const scripts = [{ script: '/js/formatDate.js' }];
      res.render('pages/services/index.hbs', { services, documentCount, scripts, filter });
    } catch (error) {
      next(error);
    }
  }

  async getServicesById(req, res, next) {
    const { id } = req.params;
    try {
      const service = await servicesDao.getByIdAndPopulate(id);

      if (!service) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .render('pages/404', { message: 'El servicio no existe o fue eliminado' });
      } else {
        res.status(HTTP_STATUS.OK).render('pages/services/show', { service });
      }
    } catch (error) {
      next(error);
    }
  }

  async saveService(req, res, next) {
    const {
      client,
      refUnit,
      orderNumber,
      serviceDate,
      hours,
      handWorkHours,
      ticket,
      isInWarranty,
      parts,
      fixes,
      observations,
      technician,
      checkedTasks,
      newTasks,
    } = req.body;

    const formattedServiceDate = moment(serviceDate).tz('UTC').format('YYYY/MM/DD');
    const isInWarrantyBoolean = isInWarranty === 'true' || isInWarranty === true;
    const parsedHours = +hours;
    const parsedOrderNumber = +orderNumber;

    try {
      const service = {
        client,
        refUnit,
        orderNumber: parsedOrderNumber,
        serviceDate: formattedServiceDate,
        hours: parsedHours,
        handWorkHours: parseFloat(handWorkHours) || null,
        ticket,
        isInWarranty: isInWarrantyBoolean,
        parts,
        fixes,
        observations,
        technician: technician.toUpperCase(),
      };

      if (checkedTasks.length > 0) {
        checkedTasks.forEach(async (task) => {
          const pendingTask = await PendingTasksDao.getById(task._id);
          if (pendingTask.refUnit) {
            await refUnitsDao.removePendingTask(task.refUnit, task._id);
            await PendingTasksDao.delete(task._id);
          }
        });
      }

      if (newTasks.length > 0) {
        newTasks.forEach(async (task) => {
          const taskId = await PendingTasksDao.save(task);
          await refUnitsDao.addPendingTask(task.refUnit, taskId);
        });
      }

      const newServiceId = await servicesDao.save(service);
      // Add Service to refUnit.services array.
      const addedService = await refUnitsDao.addService(service.refUnit, newServiceId);
      res.status(200).json(newServiceId);
    } catch (error) {
      console.log('error in saveService controller', error);
      next(error);
    }
  }

  async updateService(req, res, next) {
    const { id } = req.params;
    const {
      orderNumber,
      serviceDate,
      hours,
      handWorkHours,
      ticket,
      isInWarranty,
      parts,
      fixes,
      observations,
      technician,
    } = req.body;

    const oldService = await servicesDao.getById(id);
    const { client, refUnit } = oldService;

    const formattedServiceDate = moment(serviceDate).tz('GMT').format('YYYY/MM/DD');
    const isInWarrantyBoolean = Boolean(isInWarranty);

    try {
      const updatedService = {
        client,
        refUnit,
        orderNumber: +orderNumber,
        serviceDate: formattedServiceDate,
        hours: +hours,
        handWorkHours: parseFloat(handWorkHours),
        ticket,
        isInWarranty: isInWarrantyBoolean,
        parts,
        fixes,
        observations,
        technician: technician.toUpperCase() || null,
      };

      const response = await servicesDao.update(id, updatedService);
      res.status(200).json(response);
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

  async newServiceForm(req, res, next) {
    try {
      const { refUnitId } = req.params;
      const refUnit = await refUnitsDao.getByIdAndPopulate(refUnitId);
      const scripts = [
        { script: '/js/newServiceFormHandler.js' },
        { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      ];
      res.render('pages/services/new', { refUnit, scripts, refUnitId });
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

  async searchServiceByOrder(req, res, next) {
    let query = req.query.q;
    try {
      if (!query) {
        const services = await servicesDao.getAllAndPopulate();
        res.status(HTTP_STATUS.OK).render('pages/services', { services });
      } else {
        const services = await servicesDao.findNumber({ orderNumber: { $eq: +query } }, 'refUnit');
        // const services = await servicesDao.find({ $text: { $search: query } }, 'refUnit');

        res.status(HTTP_STATUS.OK).render('pages/services', { services });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //   async uploadAttachment(req, res, next) {
  //     const { serviceId } = req.body;
  //     const attachment = req.files[0];
  //     try {
  //       const service = await servicesDao.addAttachments(serviceId, attachment);
  //       res.status(HTTP_STATUS.OK).json(service);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

module.exports = new ServicesController();
