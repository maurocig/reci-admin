const mongoose = require('mongoose');
const PendingTasksDao = require('../models/daos/pendingTasks.mongo.dao');
const RefUnitsMongoDao = require('../models/daos/refUnits.mongo.dao');
const pendingTasksMongoDao = require('../models/daos/pendingTasks.mongo.dao');

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

  /* async getPendingTaskById(req, res, next) { */
  /*   const { id } = req.params; */
  /*   try { */
  /*     const pendingTask = await PendingTasksDao.getByIdAndPopulate(id); */
  /*     res.status(200).render('pages/pendingTasks/show', { pendingTask }); */
  /*   } catch (error) { */
  /*     next(error); */
  /*   } */
  /* } */

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

      res.redirect(`/equipos/${pendingTask.refUnit._id}`);
    } catch (error) {
      next(error);
    }
  }

  /* async toggleStatus(req, res, next) { */
  /*   const { id } = req.params; */
  /*   console.log(`llega a controller con id ${id}`); */
  /*   try { */
  /*     const pendingTask = await PendingTasksDao.getById(id); */
  /*     pendingTask.completed = !pendingTask.completed; */
  /*     await PendingTasksDao.update(id, pendingTask); */
  /*     res.redirect(`/equipos/${pendingTask.refUnit}`); */
  /*   } catch (err) { */
  /*     next(error); */
  /*   } */
  /* } */

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
