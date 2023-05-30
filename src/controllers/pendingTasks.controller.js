const mongoose = require('mongoose');
const PendingTasksDao = require('../models/daos/pendingTasks.mongo.dao');
const RefUnitsMongoDao = require('../models/daos/refUnits.mongo.dao');
const pendingTasksMongoDao = require('../models/daos/pendingTasks.mongo.dao');

const refUnitsMongoDao = new RefUnitsMongoDao();

class PendingTasksController {
  async getPendingTasks(req, res, next) {
    try {
      const pendingTasks = await PendingTasksDao.getAllAndPopulate();

      res.render('pages/pendingTasks/index.hbs', { pendingTasks });
      // res.send(pendingTasks);
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

      const pendingTaskId = await PendingTasksDao.save(pendingTask);

      // Add Pending task to refUnit.pendingTasks array.
      const addedPendingTask = await refUnitsMongoDao.addPendingTask(refUnit, pendingTaskId);

      res.redirect(`/equipos/${pendingTask.refUnit}`);
    } catch (error) {
      next(error);
    }
  }

  async updatePendingTask(req, res, next) {
    const { id } = req.params;
    const { taskDescription, client, refUnit, completed } = req.body;

    const pendingTask = await PendingTasksDao.getByIdAndPopulate(id);

    try {
      const updatedTask = { taskDescription, client, refUnit, completed: Boolean(completed) };
      await PendingTasksDao.update(id, updatedTask);

      res.redirect(`/equipos/${pendingTask.refUnit._id}#pendingTasks`);
    } catch (error) {
      next(error);
    }
  }

  async editTaskForm(req, res, next) {
    const { id } = req.params;
    try {
      const pendingTask = await PendingTasksDao.getByIdAndPopulate(id);
      res.render('pages/pendingTasks/edit', { pendingTask });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PendingTasksController();
