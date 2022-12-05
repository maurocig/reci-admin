const HTTP_STATUS = require('../constants/api.constants');
const { RefUnitsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const refUnitsDao = new RefUnitsDao();

class RefUnitsController {
  async getRefUnits(req, res, next) {
    try {
      const refUnits = await refUnitsDao.getAll();

      /* // JSON */
      /*       const response = successResponse(refUnits); */
      /*       res.status(HTTP_STATUS.OK).json(response); */

      res.status(HTTP_STATUS.OK).render('pages/refUnits/', { refUnits });
    } catch (error) {
      next(error);
    }
  }

  async getRefUnitsById(req, res, next) {
    const { id } = req.params;
    try {
      // const refUnit = await refUnitsDao.getById(id);
      const refUnit = await refUnitsDao.getByIdAndPopulate(id);
      res.status(HTTP_STATUS.OK).render('pages/refUnits/show', { refUnit });
    } catch (error) {
      next(error);
    }
  }

  async saveRefUnit(req, res, next) {
    try {
      const {
        serialNumber,
        model,
        services,
        hours,
        client,
        plate,
        soldByReci,
      } = req.body;

      const refUnit = {
        serialNumber,
        model,
        services,
        hours,
        client,
        plate,
        soldByReci,
      };
      const newRefUnitId = await refUnitsDao.save(refUnit);

      /* // JSON */
      /*       const response = successResponse(newRefUnit); */
      /*       res.status(HTTP_STATUS.CREATED).json(response); */

      const response = {
        refUnit: refUnit,
        id: newRefUnitId,
        message: 'Se creó un nuevo equipo',
      };
      console.log(response);
      res.render('pages/refUnits', { response });
    } catch (error) {
      next(error);
    }
  }

  async newRefUnitForm(req, res, next) {
    const { clientId } = req.params;
    try {
      res.render('pages/refUnits/new', { clientId });
    } catch (error) {}
  }

  async updateRefUnit(req, res, next) {
    const { id } = req.params;
    try {
      const updatedRefUnit = await refUnitsDao.update(id, req.body);
      const response = successResponse(updatedRefUnit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteRefUnit(req, res, next) {
    const { id } = req.params;
    try {
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
      const updatedRefUnit = await refUnitsDao.removeService(
        refUnitId,
        serviceId
      );
      const response = successResponse(updatedRefUnit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new RefUnitsController();
