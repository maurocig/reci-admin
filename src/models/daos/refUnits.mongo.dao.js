const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');
const { HttpError } = require('../../utils/api.utils');
const { HTTP_STATUS } = require('../../constants/api.constants');

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
    plate: { type: String, uppercase: true, required: true },
    model: { type: String, uppercase: true, requried: true },
    services: [{ type: Schema.Types.ObjectId, ref: 'services', sparse: true }],
    soldByReci: { type: Schema.Types.Boolean },
    warrantyDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

class RefUnitsMongoDao extends MongoContainer {
  constructor() {
    super(collection, refUnitSchema);
  }

  async getByIdAndPopulate(id) {
    const refUnit = await this.model
      .findById(id)
      .populate('client', 'name')
      .populate('services', ['stringDate', 'orderNumber', 'fixes', 'parts'])
      .lean();
    return refUnit;
  }

  async getAllAndPopulate() {
    const refUnits = await this.model.find().populate('client', 'name').lean();
    return refUnits;
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
    if (!refUnit) {
      const message = `RefUnit with id ${refUnitId} does not exist in our records.`;
      throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
    }
    const updatedRefUnit = await this.model.updateOne(
      { id: refUnitId },
      { $pull: { services: serviceId } }
    );
    return updatedRefUnit;
  }
}

module.exports = RefUnitsMongoDao;
