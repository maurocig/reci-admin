const moment = require('moment-timezone');

const HTTP_STATUS = require('../constants/api.constants');
const { BodyKitsDao, ClientsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');
const { default: mongoose } = require('mongoose');

const bodyKitsDao = new BodyKitsDao();
const clientsDao = new ClientsDao();

class BodyKitsController {
  async getBodyKits(req, res, next) {
    const page = req.query.p || 0;

    try {
      const [bodyKits, documentCount] = await bodyKitsDao.getAllAndPopulate(page);

      res.render('pages/bodyKits/', { bodyKits, documentCount });
    } catch (error) {
      next(error);
    }
  }

  async getBodyKitById(req, res, next) {
    const { id } = req.params;
    try {
      const bodyKit = await bodyKitsDao.getByIdAndPopulate(id);
      const scripts = [
        { script: '/js/formatDate.js' },
        { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      ];
      res.status(HTTP_STATUS.OK).render('pages/bodyKits/show', { bodyKit, scripts });
    } catch (error) {
      next(error);
    }
  }

  async saveBodyKit(req, res, next) {
    try {
      let {
        client,
        serialNumber,
        plate,
        provider,
        model,
        soldByReci,
        warrantyDate,
        chassis,
        status,
        // availability,
        deliveryEstimate,
        truckBrand,
        truckModel,
        wheelbase,
        dimensions: { length, width, height },
        observations,
      } = req.body;

      if (plate === '') plate = null;
      if (warrantyDate === '') warrantyDate = null;

      const bodyKit = {
        client,
        serialNumber: serialNumber.toUpperCase(),
        plate,
        provider,
        model,
        soldByReci,
        warrantyDate,
        chassis: chassis.toUpperCase(),
        status,
        // availability,
        deliveryEstimate,
        truckBrand,
        truckModel: truckModel.toUpperCase(),
        wheelbase,
        dimensions: { length, width, height },
        observations: observations.toUpperCase(),
        services: [],
        pendingTasks: [],
      };

      //  check if plate already exists.
      if (plate) {
        const bodyKits = await bodyKitsDao.findByField('plate', plate, 'client');

        if (bodyKits.length > 0) {
          const error = new Error('La matrícula ya existe');
          console.log('Error matrícula duplicada: ', error);
          error.status = HTTP_STATUS.BAD_REQUEST;
          throw error;
        }
      }

      if (warrantyDate) {
        //   const formattedWarrantyDate = moment(warrantyDate)
        //     .tz('America/Montevideo')
        //     .format('YYYY/MM/DD');
        const formattedWarrantyDate = moment(warrantyDate).tz('UTC').format('YYYY/MM/DD');
        bodyKit.warrantyDate = formattedWarrantyDate;
      } else {
        bodyKit.warrantyDate = null;
      }

      if (deliveryEstimate) {
        //   const formattedDeliveryEstimate = moment(deliveryEstimate)
        //     .tz('America/Montevideo')
        //     .format('YYYY/MM/DD');
        const formattedDeliveryEstimate = moment(deliveryEstimate).tz('UTC').format('YYYY/MM/DD');
        bodyKit.deliveryEstimate = formattedDeliveryEstimate;
      }

      const newBodyKitId = await bodyKitsDao.save(bodyKit);
      await clientsDao.addBodyKit(bodyKit.client, newBodyKitId);

      await res.json(newBodyKitId);
    } catch (error) {
      next(error);
    }
  }

  async newBodyKitForm(req, res, next) {
    try {
      const { clientId } = req.params;
      const client = await clientsDao.getById(clientId);
      const clientName = client.name;
      const scripts = [
        { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
        { script: '/js/newBodyKitFormHandler.js' },
      ];
      res.render('pages/bodyKits/new', { clientId, clientName, scripts });
    } catch (error) {
      console.log(error);
    }
  }

  async editBodyKitForm(req, res, next) {
    const { bodyKitId } = req.params;
    const bodyKit = await bodyKitsDao.getByIdAndPopulate(bodyKitId);
    const scripts = [
      { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      { script: '/js/formatDate.js' },
      { script: '/js/editBodyKitFormHandler.js' },
    ];
    res.render('pages/bodyKits/edit', { bodyKit, scripts });
  }

  async updateBodyKit(req, res, next) {
    const { id } = req.params;

    let {
      serialNumber,
      provider,
      model,
      plate,
      warrantyDate,
      soldByReci,
      chassis,
      status,
      // priority,
      dimensions,
      availability,
      deliveryEstimate,
      truckBrand,
      truckModel,
      wheelbase,
      observations,
    } = req.body;

    if (plate === '') plate = null;
    if (!soldByReci) warrantyDate = null;

    try {
      const updatedBodyKit = {
        serialNumber: serialNumber.toUpperCase(),
        model,
        plate,
        provider,
        soldByReci,
        chassis: chassis.toUpperCase(),
        status,
        // priority,
        dimensions,
        availability,
        deliveryEstimate,
        truckBrand,
        truckModel,
        wheelbase,
        observations,
      };

      if (warrantyDate) {
        const formattedWarrantyDate = moment(warrantyDate).tz('UTC').format('YYYY/MM/DD');
        updatedBodyKit.warrantyDate = formattedWarrantyDate;
      } else {
        updatedBodyKit.warrantyDate = null;
      }

      if (deliveryEstimate) {
        const formattedDeliveryEstimate = moment(deliveryEstimate).tz('UTC').format('YYYY/MM/DD');
        updatedBodyKit.deliveryEstimate = formattedDeliveryEstimate;
      }

      await bodyKitsDao.update(mongoose.Types.ObjectId(id), updatedBodyKit);
      // await bodyKitsDao.update(id, updatedBodyKit);
      await res.json(id);
    } catch (error) {
      next(error);
    }
  }

  async deleteBodyKit(req, res, next) {
    const { id } = req.params;
    const bodyKit = await bodyKitsDao.getById(id);
    try {
      await clientsDao.removeBodyKit(bodyKit.client, id);
      const deletedBodyKit = await bodyKitsDao.delete(id);
      const response = successResponse(deletedBodyKit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async addServiceToBodyKit(req, res, next) {
    const { bodyKitId, serviceId } = req.params;
    try {
      const updatedBodyKit = await bodyKitsDao.addService(bodyKitId, serviceId);
      const response = successResponse(updatedBodyKit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeServiceFromBodyKit(req, res, next) {
    const { bodyKitId, serviceId } = req.params;
    try {
      const updatedBodyKit = await bodyKitsDao.removeService(bodyKitId, serviceId);
      const response = successResponse(updatedBodyKit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async searchBodyKit(req, res, next) {
    let query = req.query.q;
    try {
      if (!query) {
        const bodyKits = await bodyKitsDao.getAll();
        res.status(HTTP_STATUS.OK).render('pages/bodyKits', { bodyKits });
      } else {
        const bodyKits = await bodyKitsDao.find({ $text: { $search: query } }, 'client');
        res.status(HTTP_STATUS.OK).render('pages/bodyKits', { bodyKits });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async filterBodyKit(req, res, next) {
    const { f } = req.query;
    let query;

    try {
      if (f === 'plate' || f === 'serialNumber') {
        query = await JSON.parse(`{"${f}": null}`);
      } else if (f === 'pendingTasks') {
        query = {
          $and: [
            { pendingTasks: { $ne: [] } },
            { pendingTasks: { $exists: true } },
            // { pendingTasks: { $elemMatch: { completed: false } } },
          ],
        };
      } else if (f === 'soldByReci') {
        query = { soldByReci: true };
      }

      const bodyKits = await bodyKitsDao.find(query, 'client');

      res.status(HTTP_STATUS.OK).render('pages/bodyKits', { bodyKits, f });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BodyKitsController();
