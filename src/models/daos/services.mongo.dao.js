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
    handWorkHours: { type: Number },
    ticket: { type: String },
    isInWarranty: { type: Boolean },
    parts: [{ type: Object }],
    fixes: [{ type: Object, required: true }],
    observations: { type: String },
    technician: { type: String },
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
      .populate('refUnit')
      .lean();
    return service;
  }

  async getAllAndPopulate(page, filter = null) {
    const documentCount = await this.model.countDocuments();
    const servicesPerPage = 30;
    let services;

    if (!filter) {
      services = await this.model
        .find()
        .sort({ serviceDate: 'desc' })
        // pagination
        .skip(page * servicesPerPage)
        .limit(servicesPerPage)
        .populate('client', 'name')
        .populate('refUnit', ['plate', 'model', 'serialNumber', 'soldByReci'])
        .lean();
    } else {
      services = await this.model
        .find(filter)
        .sort({ serviceDate: 'desc' })
        .populate('client', 'name')
        .populate('refUnit', ['plate', 'model', 'serialNumber', 'soldByReci'])
        .lean();
    }

    return [services, documentCount, filter];
  }

  async getAllWithRefUnits(filter = {}) {
    const services = await this.model
      .find(filter, { __v: 0 })
      .sort({ serviceDate: 'desc' })
      .populate('refUnit', ['plate', 'model', 'serialNumber'])
      .lean();
    return services;
  }

  async findNumber(filter = {}, collectionRef = '') {
    const documents = await this.model
      .find(filter, { __v: 0 })
      .populate('client', 'name')
      .populate('refUnit', ['plate', 'model', 'serialNumber'])
      .lean();
    return documents;
  }
}

module.exports = ServicesMongoDao;
