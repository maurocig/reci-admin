const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'services';

const serviceSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits' },
    orderNumber: { type: Number, unique: true, required: true },
    serviceDate: { type: Date },
    hours: { type: Number },
    ticket: { type: String },
    isInWarranty: { type: Boolean },
    parts: [{ type: Object }],
    fixes: [{ type: Object, required: true }],
  },
  {
    timestamps: true,
  }
);

class ServicesMongoDao extends MongoContainer {
  constructor() {
    super(collection, serviceSchema);
  }

  async getByIdAndPopulate(id) {
    const service = await this.model
      .findById(id)
      .populate('client', ['name'])
      .populate('refUnit', ['model', 'serialNumber', 'plate'])
      .lean();
    return service;
  }

  async getAllAndPopulate() {
    const services = await this.model
      .find({})
      .sort({ serviceDate: 'desc' })
      .populate('client', 'name')
      .populate('refUnit', ['plate', 'model'])
      .lean();
    return services;
  }
}

module.exports = ServicesMongoDao;
