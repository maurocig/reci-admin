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
    attachments: [{ type: Object }],
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
      .populate('attachments')
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
      .populate('client', 'name')
      .lean();
    return services;
  }

  async findNumber(filter = {}, collectionRef = '') {
    const documents = await this.model
      .find(filter, { __v: 0 })
      .populate('client', 'name')
      .populate('refUnit', ['plate', 'model', 'serialNumber', 'soldByReci'])
      .lean();
    return documents;
  }

  async findByField(field, value, collectionRef = 'client') {
    const service = await this.model
      .find({ [field]: { $regex: value, $options: 'i' } })
      .sort({ createdAt: 'desc' })
      .populate(collectionRef)
      .lean();
    console.log(service);
    return service;
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

  async addAttachments(serviceId, fileReferences) {
    const service = await this.model.findOne({ _id: serviceId }, { __v: 0 });
    if (!service) {
      const message = `Service with id ${serviceId} does not exist in our records.`;
      console.log(message);
      throw new HttpError(404, message);
    }

    let updatedService = {};
    fileReferences.forEach(async (fileReference) => {
      updatedService = await this.model.updateOne(
        { _id: serviceId },
        { $addToSet: { attachments: fileReference } }
      );
    });
    return serviceId;
  }

  async deleteAttachment(serviceId, fileId) {
    const service = await this.model.findOne({ _id: serviceId }, { __v: 0 });
    if (!service) {
      const message = `Unit with id ${service} does not exist in our records.`;
      console.log(message);
    }
    const updatedService = await this.model.updateOne(
      { _id: serviceId },
      { $pull: { attachments: { id: fileId } } }
    );
    return updatedService;
  }
}

module.exports = ServicesMongoDao;
