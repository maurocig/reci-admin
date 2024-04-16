const moment = require('moment-timezone');

const HTTP_STATUS = require('../constants/api.constants');
const { BodykitServicesDao, BodyKitsDao } = require('../models/daos/app.daos');
const PendingTasksDao = require('../models/daos/pendingTasks.mongo.dao');
const { successResponse } = require('../utils/api.utils');
const { default: mongoose } = require('mongoose');

const bodykitServicesDao = new BodykitServicesDao();
const bodyKitsDao = new BodyKitsDao();

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
        [services, documentCount] = await bodykitServicesDao.getAllAndPopulate(page, {
          serviceDate: {
            $gte: start,
            $lt: end,
          },
        });
      } else if (filter && filter === 'no-ticket') {
        [services, documentCount] = await bodykitServicesDao.getAllAndPopulate(page, {
          ticket: { $eq: '' },
        });
      } else {
        [services, documentCount] = await bodykitServicesDao.getAllAndPopulate(page);
      }

      const scripts = [{ script: '/js/formatDate.js' }];
      res.render('pages/bodykitServices/index.hbs', { services, documentCount, scripts, filter });
    } catch (error) {
      next(error);
    }
  }

  async getServicesById(req, res, next) {
    const { id } = req.params;
    try {
      const service = await bodykitServicesDao.getByIdAndPopulate(id);

      res.status(HTTP_STATUS.OK).render('pages/services/show', { service });
    } catch (error) {
      next(error);
    }
  }

  async saveService(req, res, next) {
    const {
      client,
      bodyKit,
      orderNumber,
      serviceDate,
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

    const formattedServiceDate = moment.utc(serviceDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
    const isInWarrantyBoolean = isInWarranty === 'true' || isInWarranty === true;
    const parsedOrderNumber = +orderNumber;

    try {
      const service = {
        client,
        bodyKit,
        orderNumber: parsedOrderNumber,
        serviceDate: formattedServiceDate,
        handWorkHours: parseFloat(handWorkHours) || null,
        ticket,
        isInWarranty: isInWarrantyBoolean,
        parts,
        fixes,
        observations,
        technician: technician.toUpperCase(),
      };

      // // tasks
      // if (checkedTasks.length > 0) {
      //   checkedTasks.forEach(async (task) => {
      //     const pendingTask = await PendingTasksDao.getById(task._id);
      //     if (pendingTask.bodyKit) {
      //       await bodyKitsDao.removePendingTask(task.bodyKit, task._id);
      //       await PendingTasksDao.delete(task._id);
      //     }
      //   });
      // }

      // if (newTasks.length > 0) {
      //   newTasks.forEach(async (task) => {
      //     const taskId = await PendingTasksDao.save(task);
      //     await bodyKitsDao.addPendingTask(task.bodyKit, taskId);
      //   });
      // }

      const newServiceId = await bodykitServicesDao.save(service);

      // Add Service to bodyKit.services array.
      const addedService = await bodyKitsDao.addService(service.bodyKit, newServiceId);
      res.json({ id: newServiceId, status: 200 });
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

    const oldService = await bodykitServicesDao.getById(id);
    const { client, bodyKit } = oldService;

    const formattedServiceDate = moment(serviceDate).tz('GMT').format('YYYY/MM/DD');
    const isInWarrantyBoolean = Boolean(isInWarranty);

    try {
      const updatedService = {
        client,
        bodyKit,
        orderNumber: +orderNumber,
        serviceDate: formattedServiceDate,
        hours: +hours,
        handWorkHours: parseFloat(handWorkHours),
        ticket,
        isInWarranty: isInWarrantyBoolean,
        parts,
        fixes,
        observations,
        technician: technician.toUpperCase(),
      };

      const response = await bodykitServicesDao.update(id, updatedService);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    const { id } = req.params;
    try {
      const service = await bodykitServicesDao.getById(id);
      if (service.bodyKit) {
        await bodyKitsDao.removeService(service.bodyKit, id);
      }
      const deletedService = await bodykitServicesDao.delete(id);
      const response = successResponse(deletedService);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async newServiceForm(req, res, next) {
    try {
      const { bodyKitId } = req.params;
      const bodyKit = await bodyKitsDao.getByIdAndPopulate(bodyKitId);
      const scripts = [
        { script: '/js/newBodykitServiceFormHandler.js' },
        { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      ];
      res.render('pages/bodykitServices/new', { bodyKit, scripts, bodyKitId });
    } catch (error) {
      console.log(error);
    }
  }

  async editServiceForm(req, res, next) {
    const { serviceId } = req.params;
    const service = await bodykitServicesDao.getByIdAndPopulate(serviceId);
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
        const services = await bodykitServicesDao.getAllAndPopulate();
        res.status(HTTP_STATUS.OK).render('pages/services', { services });
      } else {
        const services = await bodykitServicesDao.findNumber(
          { orderNumber: { $eq: +query } },
          'bodyKit'
        );
        // const services = await bodykitServicesDao.find({ $text: { $search: query } }, 'bodyKit');

        res.status(HTTP_STATUS.OK).render('pages/services', { services });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new ServicesController();
