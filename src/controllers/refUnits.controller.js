const moment = require('moment-timezone');

const HTTP_STATUS = require('../constants/api.constants');
const { RefUnitsDao, ClientsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const refUnitsDao = new RefUnitsDao();
const clientsDao = new ClientsDao();

class RefUnitsController {
  async getRefUnits(req, res, next) {
    const page = req.query.p || 0;

    try {
      const refUnits = await refUnitsDao.getAllAndPopulate(page);

      res.render('pages/refUnits/', { refUnits });
    } catch (error) {
      next(error);
    }
  }

  async getRefUnitsById(req, res, next) {
    const { id } = req.params;
    try {
      const refUnit = await refUnitsDao.getByIdAndPopulate(id);
      const scripts = [
        { script: '/js/formatDate.js' },
        { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      ];

      res.status(HTTP_STATUS.OK).render('pages/refUnits/show', { refUnit, scripts });
    } catch (error) {
      next(error);
    }
  }

  async saveRefUnit(req, res, next) {
    try {
      let { serialNumber, model, services, hours, client, plate, soldByReci, warrantyDate } =
        req.body;

      const soldByReciBool = Boolean(soldByReci);

      const refUnit = {
        serialNumber,
        model,
        services,
        hours,
        client,
        plate,
        soldByReci: soldByReciBool,
      };

      if (warrantyDate) {
        const formattedWarrantyDate = moment(warrantyDate).tz('GMT').format('YYYY/MM/DD');
        refUnit.warrantyDate = formattedWarrantyDate;
      } else {
        refUnit.warrantyDate = null;
      }

      const newRefUnitId = await refUnitsDao.save(refUnit);

      // add refUnit to clients.refUnits array.
      const addedRefUnit = await clientsDao.addRefUnit(refUnit.client, newRefUnitId);
      console.log(addedRefUnit);

      res.redirect(`/equipos/${newRefUnitId}`);
    } catch (error) {
      next(error);
    }
  }

  async newRefUnitForm(req, res, next) {
    try {
      const { clientId } = req.params;
      const client = await clientsDao.getById(clientId);
      const clientName = client.name;
      res.render('pages/refUnits/new', { clientId, clientName });
    } catch (error) {
      console.log(error);
    }
  }

  async editRefUnitForm(req, res, next) {
    const { refUnitId } = req.params;
    const refUnit = await refUnitsDao.getByIdAndPopulate(refUnitId);
    const scripts = [
      { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
      { script: '/js/formatDate.js' },
    ];
    res.render('pages/refUnits/edit', { refUnit, scripts });
  }

  async updateRefUnit(req, res, next) {
    const { id } = req.params;

    const { model, plate, warrantyDate, soldByReci, serialNumber } = req.body;

    try {
      const soldByReciBool = Boolean(soldByReci);

      const updatedRefUnit = {
        serialNumber,
        model,
        plate,
        soldByReci: soldByReciBool,
      };

      if (warrantyDate) {
        const formattedWarrantyDate = moment(warrantyDate).tz('GMT').format('YYYY/MM/DD');
        updatedRefUnit.warrantyDate = formattedWarrantyDate;
      } else {
        updatedRefUnit.warrantyDate = null;
      }
      await refUnitsDao.update(id, updatedRefUnit);

      res.redirect(`/equipos/${id}`);
    } catch (error) {
      next(error);
    }
  }

  async deleteRefUnit(req, res, next) {
    const { id } = req.params;
    const refUnit = await refUnitsDao.getById(id);
    try {
      await clientsDao.removeRefUnit(refUnit.client, id);
      const deletedRefUnit = await refUnitsDao.delete(id);
      const response = successResponse(deletedRefUnit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async addServiceToRefUnit(req, res, next) {
    const { refUnitId, serviceId } = req.params;
    try {
      const updatedRefUnit = await refUnitsDao.addService(refUnitId, serviceId);
      const response = successResponse(updatedRefUnit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeServiceFromRefUnit(req, res, next) {
    const { refUnitId, serviceId } = req.params;
    try {
      const updatedRefUnit = await refUnitsDao.removeService(refUnitId, serviceId);
      const response = successResponse(updatedRefUnit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async searchRefUnitByPlate(req, res, next) {
    let query = req.query.q;
    try {
      if (!query) {
        const refUnits = await refUnitsDao.getAll();
        res.status(HTTP_STATUS.OK).render('pages/refUnits', { refUnits });
      } else {
        const refUnits = await refUnitsDao.findByField('plate', query, 'client');
        console.log(refUnits);
        res.status(HTTP_STATUS.OK).render('pages/refUnits', { refUnits });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async searchRefUnit(req, res, next) {
    let query = req.query.q;
    try {
      if (!query) {
        const refUnits = await refUnitsDao.getAll();
        res.status(HTTP_STATUS.OK).render('pages/refUnits', { refUnits });
      } else {
        const refUnits = await refUnitsDao.find({ $text: { $search: query } }, 'client');
        res.status(HTTP_STATUS.OK).render('pages/refUnits', { refUnits });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new RefUnitsController();
