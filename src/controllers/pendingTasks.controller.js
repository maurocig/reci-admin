const PendingTasksDao = require('../models/daos/pendingTasks.mongo.dao');
const RefUnitsMongoDao = require('../models/daos/refUnits.mongo.dao');

const refUnitsDao = new RefUnitsMongoDao();

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
      const addedPendingTask = await refUnitsDao.addPendingTask(refUnit, pendingTaskId);

      res.redirect(`/equipos/${pendingTask.refUnit}#pendingTasks`);
    } catch (error) {
      next(error);
    }
  }

  async updatePendingTask(req, res, next) {
    const { id } = req.params;
    const { taskDescription, client, refUnit, completed } = req.body;

    try {
      const pendingTask = await PendingTasksDao.getByIdAndPopulate(id);
      const updatedTask = { taskDescription, client, refUnit, completed: Boolean(completed) };

      // remove pending task from refUnit.pendingTasks array and delete it if completed is true.
      if (updatedTask.completed && pendingTask.refUnit) {
        await refUnitsDao.removePendingTask(pendingTask.refUnit, id);
        await PendingTasksDao.delete(id);
        res.redirect(`/equipos/${pendingTask.refUnit._id}#pendingTasks`);
      } else {
        await PendingTasksDao.update(id, updatedTask);
      }
    } catch (error) {
      next(error);
    }
  }

  async deletePendingTask(req, res, next) {
    const { id } = req.params;
    try {
      const pendingTask = await PendingTasksDao.getById(id);
      if (pendingTask.refUnit) {
        const updatedRefUnit = await refUnitsDao.removePendingTask(pendingTask.refUnit, id);
        await PendingTasksDao.delete(id);
        res.status(200).send({ message: 'task successfully deleted' });
      }
    } catch (error) {
      next(error);
    }
  }

  async editTaskForm(req, res, next) {
    const { id } = req.params;
    try {
      const pendingTask = await PendingTasksDao.getByIdAndPopulate(id);
      const scripts = [
        // { script: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
        // { script: 'https://cdn.jsdelivr.net/npm/method-override@2.3.10/index.js' },
      ];
      res.render('pages/pendingTasks/edit', { pendingTask, scripts });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PendingTasksController();
