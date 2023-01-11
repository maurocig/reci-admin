const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'services';

const serviceSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits' },
    orderNumber: { type: Number, unique: true, required: true },
    serviceDate: {
      type: Date,
      // get: (date) => date.toLocaleDateString('en-GB'),
    },
    stringDate: { type: String },
    hours: { type: Number },
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
      .populate('client', 'name')
      .populate('refUnit', ['model', 'serialNumber'])
      .lean();
    return service;
  }
}

module.exports = ServicesMongoDao;