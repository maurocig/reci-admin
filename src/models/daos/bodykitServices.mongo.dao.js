const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'bodykitServices';

const serviceSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    bodyKit: { type: Schema.Types.ObjectId, ref: 'bodyKits' },
    orderNumber: { type: Number, unique: true, required: true, index: true },
    serviceDate: { type: Date },
    handWorkHours: { type: Number },
    ticket: { type: String },
    isInWarranty: { type: Boolean },
    parts: [{ type: Object }],
    fixes: [{ type: Object, required: true }],
    observations: { type: String },
    technician: { type: String },
    attachments: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);
serviceSchema.index({ '$**': 'text' });

class BodykitServicesMongoDao extends MongoContainer {
  constructor() {
    super(collection, serviceSchema);
  }

  async getByIdAndPopulate(id) {
    const service = await this.model
      .findById(id)
      .populate('client', ['name'])
      .populate('bodyKit')
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
        .populate('bodyKit', ['plate', 'model', 'serialNumber', 'soldByReci'])
        .lean();
    } else {
      services = await this.model
        .find(filter)
        .sort({ serviceDate: 'desc' })
        .populate('client', 'name')
        .populate('bodyKit', ['plate', 'model', 'serialNumber', 'soldByReci'])
        .lean();
    }
    return [services, documentCount, filter];
  }

  async getAllWithBodykits(filter = {}) {
    const services = await this.model
      .find(filter, { __v: 0 })
      .sort({ serviceDate: 'desc' })
      .populate('bodyKit', ['plate', 'model', 'serialNumber'])
      .populate('client', 'name')
      .lean();
    return services;
  }

  async findNumber(filter = {}, collectionRef = '') {
    const documents = await this.model
      .find(filter, { __v: 0 })
      .populate('client', 'name')
      .populate('bodyKit', ['plate', 'model', 'serialNumber'])
      .lean();
    return documents;
  }

  async addAttachments(bodykitServiceId, fileReferences) {
    const bodykitService = await this.model.findOne({ _id: bodykitServiceId }, { __v: 0 });

    if (!bodykitService) {
      const message = `Service with id ${bodykitServiceId} does not exist in our records.`;
      console.log(message);
      throw new HttpError(404, message);
    }

    let updatedService = {};
    fileReferences.forEach(async (fileReference) => {
      updatedService = await this.model.updateOne(
        { _id: bodykitServiceId },
        { $addToSet: { attachments: fileReference } }
      );
    });
    return bodykitServiceId;
  }
}

module.exports = BodykitServicesMongoDao;
