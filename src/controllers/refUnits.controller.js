const HTTP_STATUS = require('../constants/api.constants');
const { RefUnitsDao, ClientsDao } = require('../models/daos/app.daos');
const { successResponse } = require('../utils/api.utils');

const refUnitsDao = new RefUnitsDao();
const clientsDao = new ClientsDao();

class RefUnitsController {
  async getRefUnits(req, res, next) {
    try {
      const refUnits = await refUnitsDao.getAllAndPopulate();
      console.log(refUnits);

      // // JSON
      // const response = successResponse(refUnits);
      // res.status(HTTP_STATUS.OK).json(response);

      res.status(HTTP_STATUS.OK).render('pages/refUnits/', { refUnits });
    } catch (error) {
      next(error);
    }
  }

  async getRefUnitsById(req, res, next) {
    const { id } = req.params;
    try {
      const refUnit = await refUnitsDao.getByIdAndPopulate(id);

      res.status(HTTP_STATUS.OK).render('pages/refUnits/show', { refUnit });
    } catch (error) {
      next(error);
    }
  }

  async saveRefUnit(req, res, next) {
    try {
      let { serialNumber, model, services, hours, client, plate, soldByReci } =
        req.body;

      soldByReci = Boolean(req.body.soldByReci);

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

      // add refUnit to clients.refUnits array.
      const addedRefUnit = await clientsDao.addRefUnit(
        refUnit.client,
        newRefUnitId
      );
      console.log(addedRefUnit);

      const response = {
        refUnit: refUnit,
        id: newRefUnitId,
        message: 'Se creó un nuevo equipo',
      };
      console.log(response);

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
    } catch (error) {}
  }

  async editRefUnitForm(req, res, next) {
    const { refUnitId } = req.params;
    const refUnit = await refUnitsDao.getByIdAndPopulate(refUnitId);
    res.render('pages/refUnits/edit', { refUnit });
  }

  async updateRefUnit(req, res, next) {
    const { id } = req.params;
    try {
      req.body.soldByReci = Boolean(req.body.soldByReci);
      const updatedRefUnit = await refUnitsDao.update(id, req.body);

      // const response = successResponse(updatedRefUnit);
      // res.status(HTTP_STATUS.OK).json(response);

      res.redirect(`/equipos/${id}`);
    } catch (error) {
      next(error);
    }
  }

  async deleteRefUnit(req, res, next) {
    console.log('delete request received');
    const { id } = req.params;
    const refUnit = await refUnitsDao.getById(id);
    console.log(refUnit);
    try {
      await clientsDao.removeRefUnit(refUnit.client, id);
      const deletedRefUnit = await refUnitsDao.delete(id);
      const response = successResponse(deletedRefUnit);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
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
