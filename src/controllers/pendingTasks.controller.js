const mongoose = require('mongoose');
const PendingTasksDao = require('../models/daos/pendingTasks.mongo.dao');
const RefUnitsMongoDao = require('../models/daos/refUnits.mongo.dao');

const refUnitsMongoDao = new RefUnitsMongoDao();

class PendingTasksController {
  async getPendingTasks(req, res, next) {
    try {
      const pendingTasks = await PendingTasksDao.getAllAndPopulate();

      // res.render('pages/pendingTask/index.hbs', { pendingTasks });
      res.send(pendingTasks);
    } catch (error) {
      next(error);
    }
  }

  async getPendingTaskById(req, res, next) {
    const { id } = req.params;
    try {
      const pendingTask = await pendingTasksDao.getByIdAndPopulate(id);

      res.status(HTTP_STATUS.OK).render('pages/pendingTasks/show', { pendingTask });
    } catch (error) {
      next(error);
    }
  }

  async savePendingTask(req, res, next) {
    const { taskDescription, client, refUnit } = req.body;

    try {
      const pendingTask = {
        client,
        refUnit,
        taskDescription,
      };

      console.log(pendingTask);

      const pendingTaskId = await PendingTasksDao.save(pendingTask);

      // Add Pending task to refUnit.pendingTasks array.
      const addedPendingTask = await refUnitsMongoDao.addPendingTask(
        refUnit,
        client,
        pendingTaskId.toString()
      );

      res.redirect(`/equipos/${pendingTask.refUnit}`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PendingTasksController();
