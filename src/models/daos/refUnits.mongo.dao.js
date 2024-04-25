const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');
const { HttpError } = require('../../utils/api.utils');

const collection = 'refUnits';

const refUnitSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'clients',
      uppercase: true,
      required: true,
    },
    serialNumber: { type: String, unique: true, required: true },
    plate: { type: String, unique: true, uppercase: true, required: false }, // unique validation doesn't work, check happens server side on refUnits.controller.js saveRefUnit.
    model: { type: String, uppercase: true, required: true },
    services: [{ type: Schema.Types.ObjectId, ref: 'services', sparse: true }],
    pendingTasks: [{ type: Schema.Types.ObjectId, ref: 'pendingtasks', sparse: true }],
    soldByReci: { type: Schema.Types.Boolean },
    warrantyDate: { type: Date || null, default: undefined },
  },
  {
    timestamps: true,
  }
);
refUnitSchema.index({ '$**': 'text' });

class RefUnitsMongoDao extends MongoContainer {
  constructor() {
    super(collection, refUnitSchema);
  }

  async getByIdAndPopulate(id) {
    const refUnit = await this.model
      .findById(id)
      .populate('client', 'name')
      .populate('pendingTasks', ['taskDescription', 'completed'])
      .populate({
        path: 'services',
        select: ['serviceDate', 'orderNumber', 'fixes', 'parts'],
        options: { sort: { serviceDate: 'desc' } },
      })
      .lean();
    return refUnit;
  }

  async getAllAndPopulate(page) {
    // Pagination
    const refUnitsPerPage = 30;

    const documentCount = await this.model.countDocuments();
    const refUnits = await this.model
      .find({})
      .sort({ createdAt: 'desc' })

      // pagination
      .skip(page * refUnitsPerPage)
      .limit(refUnitsPerPage)

      .populate('client', ['name', '_id'])
      .populate('pendingTasks', ['taskDescription', 'completed'])
      .populate('services', ['serviceDate', 'orderNumber'])
      .lean();
    return [refUnits, documentCount];
  }

  async addService(refUnitId, serviceId) {
    const refUnit = await this.model.findOne({ _id: refUnitId }, { __v: 0 });

    if (!refUnit) {
      const message = `RefUnit with id ${refUnitId} does not exist in our records.`;
      throw new HttpError(404, message);
    }

    const updatedRefUnit = await this.model.updateOne(
      { _id: refUnitId },
      { $addToSet: { services: serviceId } }
    );

    return updatedRefUnit;
  }

  async removeService(refUnitId, serviceId) {
    const refUnit = await this.model.findOne({ _id: refUnitId }, { __v: 0 });
    if (refUnit) {
      const updatedRefUnit = await this.model.updateOne(
        { _id: refUnitId },
        { $pull: { services: serviceId } }
      );
      return updatedRefUnit;
    } else {
      return refUnit;
    }
  }

  async addPendingTask(refUnitId, pendingTaskId) {
    const refUnit = await this.model.findOne({ _id: refUnitId }, { __v: 0 });

    if (!refUnit) {
      const message = `RefUnit with id ${refUnitId} does not exist in our records.`;
      throw new HttpError(404, message);
    }

    const updatedRefUnit = await this.model.updateOne(
      { _id: refUnitId },
      { $addToSet: { pendingTasks: pendingTaskId } }
    );

    return updatedRefUnit;
  }

  async removePendingTask(refUnitId, pendingTaskId) {
    const refUnit = await this.model.findOne({ _id: refUnitId }, { __v: 0 });
    if (refUnit) {
      const updatedRefUnit = await this.model.updateOne(
        { _id: refUnitId },
        { $pull: { pendingTasks: pendingTaskId } }
      );
      return updatedRefUnit;
    } else {
      return refUnit;
    }
  }

  async findByField(field, value, collectionRef = '') {
    const refUnit = await this.model
      .find({ [field]: { $regex: value, $options: 'i' } })
      .sort({ createdAt: 'desc' })
      .populate(collectionRef)
      .lean();
    return refUnit;
  }
}

module.exports = RefUnitsMongoDao;
