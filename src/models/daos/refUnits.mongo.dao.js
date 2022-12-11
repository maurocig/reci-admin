const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'refUnits';

const refUnitSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'clients', required: true },
    clientName: { type: String },
    serialNumber: { type: String, unique: true, required: true },
    plate: { type: String, required: true },
    model: { type: String, requried: true },
    hours: { type: Number },
    services: [{ type: Schema.Types.ObjectId, ref: 'services', sparse: true }],
    soldByReci: { type: Schema.Types.Boolean },
  },
  {
    timestamps: true,
  }
);

class RefUnitsMongoDao extends MongoContainer {
  constructor() {
    super(collection, refUnitSchema);
  }

  async getClientName(refUnitId) {
    const refUnit = await this.model
      .findOne({ _id: refUnitId })
      .populate('client', 'name');
    return refUnit.client.name;
  }

  async addService(refUnitId, serviceId) {
    const refUnit = await this.model.findOne({ _id: refUnitId }, { __v: 0 });
    if (!refUnit) {
      const message = `RefUnit with id ${refUnitId} does not exist in our records.`;
      throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
    }
    const updatedRefUnit = await this.model.updateOne(
      { _id: refUnitId },
      { $push: { services: serviceId } }
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
