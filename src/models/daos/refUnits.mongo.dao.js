const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'refUnits';

const refUnitSchema = new Schema(
  {
    serialNumber: { type: String, unique: true },
    model: { type: String },
    services: [{ type: Schema.Types.ObjectId, ref: 'services' }],
    hours: { type: Number },
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    plate: { type: String },
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
