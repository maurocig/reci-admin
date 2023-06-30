const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'services';

const serviceSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits' },
    orderNumber: { type: Number, unique: true, required: true, index: true },
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
serviceSchema.index({ '$**': 'text' });

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

  async findNumber(filter = {}, collectionRef = '') {
    const documents = await this.model
      .find(filter, { __v: 0 })
      .populate('client', 'name')
      .populate('refUnit', ['plate', 'model'])
      .lean();
    return documents;
  }
}

module.exports = ServicesMongoDao;
