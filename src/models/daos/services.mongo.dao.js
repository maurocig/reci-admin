const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'services';

const serviceSchema = new Schema(
  {
    orderNumber: { type: Number, unique: true, required: true },
    parts: [{ type: String }],
    fixes: [{ type: String, required: true }],
    price: { type: Number },
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits' },
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    clientName: { type: String },
    serviceDate: { type: Schema.Types.Date },
  },
  {
    timestamps: true,
  }
);

class ServicesMongoDao extends MongoContainer {
  constructor() {
    super(collection, serviceSchema);
  }
}

module.exports = ServicesMongoDao;
