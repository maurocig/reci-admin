const MongoContainer = require('../containers/mongo.container');
const PendingTasksSchema = require('../schemas/PendingTasks.schema');
const { RefUnitsDao } = require('./app.daos');

const refUnitsDao = new RefUnitsDao();

const collection = 'pendingtasks';

class PendingTasksDao extends MongoContainer {
  constructor() {
    super(collection, PendingTasksSchema);
  }

  async getByIdAndPopulate(id) {
    const pendingTask = await this.model
      .findById(id)
      .populate('client', 'name')
      .populate('refUnit', ['model', 'serialNumber', 'plate', '_id'])
      .lean();
    return pendingTask;
  }

  async getAllAndPopulate() {
    const pendingTasks = await this.model
      .find({})
      .sort({ createdAt: 'desc' })
      .populate('client', 'name')
      .populate('refUnit', ['plate', 'model'])
      .lean();
    return pendingTasks;
  }
}

module.exports = new PendingTasksDao();
