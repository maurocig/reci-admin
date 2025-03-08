const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');
const { HttpError } = require('../../utils/api.utils');

const collection = 'bodyKits';

const bodyKitSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'clients',
      uppercase: true,
      required: true,
    },
    serialNumber: { type: String, unique: true, required: true },
    plate: { type: String, unique: true, uppercase: true, required: false, sparse: true }, // unique validation doesn't work, check happens server side on bodyKits.controller.js saveBodyKit.
    provider: { type: String, uppercase: true, required: true },
    model: { type: String, uppercase: true, required: true },
    soldByReci: { type: Schema.Types.Boolean },
    warrantyDate: { type: Date, default: null },
    chassis: { type: String, uppercase: true, default: null },
    status: { type: String, enum: ['Producción', 'Arribada', 'Entregada', null], required: false },
    deliveryEstimate: { type: Date, default: null },
    truckBrand: { type: String, uppercase: true, default: null },
    truckModel: { type: String, uppercase: true, default: null },
    wheelbase: { type: Number, default: null }, // Distancia entre ejes
    dimensions: {
      length: { type: Number, default: null },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    observations: { type: String, uppercase: true, default: null },
    availability: { type: String, enum: ['Vendida', 'Stock'], default: 'Vendida' },
    services: [{ type: Schema.Types.ObjectId, ref: 'bodykitServices', sparse: true }],
    pendingTasks: [{ type: Schema.Types.ObjectId, ref: 'pendingtasks', sparse: true }],
    attachments: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);
bodyKitSchema.index({ '$**': 'text' });

class BodyKitsMongoDao extends MongoContainer {
  constructor() {
    super(collection, bodyKitSchema);
  }

  async getByIdAndPopulate(id) {
    let bodyKit = await this.model
      .findById(id)
      .populate('client', 'name')
      .populate('pendingTasks', ['taskDescription', 'completed'])
      .populate({
        path: 'services',
        select: ['serviceDate', 'orderNumber', 'fixes', 'parts'],
        options: { sort: { serviceDate: 'desc' } },
      })
      .lean();

    if (!bodyKit) {
      return (bodyKit = null);
    }

    return bodyKit;
  }

  async getAllAndPopulate(page, filter) {
    // Pagination
    const bodyKitsPerPage = 30;

    const documentCount = await this.model.countDocuments();
    const bodyKits = await this.model
      .find(filter)
      .sort({ createdAt: 'desc' })

      // pagination
      .skip(page * bodyKitsPerPage)
      .limit(bodyKitsPerPage)

      .populate('client', ['name', '_id'])
      .populate('pendingTasks', ['taskDescription', 'completed'])
      .populate('services', ['serviceDate', 'orderNumber'])
      .lean();
    return [bodyKits, documentCount];
  }

  async addService(bodyKitId, serviceId) {
    const bodyKit = await this.model.findOne({ _id: bodyKitId }, { __v: 0 });

    if (!bodyKit) {
      const message = `BodyKit with id ${bodyKitId} does not exist in our records.`;
      throw new HttpError(404, message);
    }

    const updatedBodyKit = await this.model.updateOne(
      { _id: bodyKitId },
      { $addToSet: { services: serviceId } }
    );

    return updatedBodyKit;
  }

  async removeService(bodyKitId, serviceId) {
    const bodyKit = await this.model.findOne({ _id: bodyKitId }, { __v: 0 });
    if (bodyKit) {
      const updatedBodyKit = await this.model.updateOne(
        { _id: bodyKitId },
        { $pull: { services: serviceId } }
      );
      return updatedBodyKit;
    } else {
      return bodyKit;
    }
  }

  async addPendingTask(bodyKitId, pendingTaskId) {
    const bodyKit = await this.model.findOne({ _id: bodyKitId }, { __v: 0 });

    if (!bodyKit) {
      const message = `BodyKit with id ${bodyKitId} does not exist in our records.`;
      throw new HttpError(404, message);
    }

    const updatedBodyKit = await this.model.updateOne(
      { _id: bodyKitId },
      { $addToSet: { pendingTasks: pendingTaskId } }
    );

    return updatedBodyKit;
  }

  async removePendingTask(bodyKitId, pendingTaskId) {
    const bodyKit = await this.model.findOne({ _id: bodyKitId }, { __v: 0 });
    if (bodyKit) {
      const updatedBodyKit = await this.model.updateOne(
        { _id: bodyKitId },
        { $pull: { pendingTasks: pendingTaskId } }
      );
      return updatedBodyKit;
    } else {
      return bodyKit;
    }
  }

  async findByField(field, value, collectionRef = '') {
    const bodyKit = await this.model
      .find({ [field]: { $regex: value, $options: 'i' } })
      .sort({ createdAt: 'desc' })
      .populate(collectionRef)
      .lean();
    return bodyKit;
  }

  async addAttachments(bodykitId, fileReferences) {
    const bodykit = await this.model.findOne({ _id: bodykitId }, { __v: 0 });
    if (!bodykit) {
      const message = `Unit with id ${bodykitId} does not exist in our records.`;
      console.log(message);
      throw new HttpError(404, message);
    }

    let updatedBodykit = {};
    fileReferences.forEach(async (fileReference) => {
      updatedBodykit = await this.model.updateOne(
        { _id: bodykitId },
        { $addToSet: { attachments: fileReference } }
      );
    });
    return bodykitId;
  }

  async deleteAttachment(bodykitId, fileId) {
    const refunit = await this.model.findOne({ _id: bodykitId }, { __v: 0 });
    if (!refunit) {
      const message = `Unit with id ${bodykitId} does not exist in our records.`;
      console.log(message);
    }
    const updatedRefunit = await this.model.updateOne(
      { _id: bodykitId },
      { $pull: { attachments: { id: fileId } } }
    );
    return updatedRefunit;
  }
}

module.exports = BodyKitsMongoDao;
