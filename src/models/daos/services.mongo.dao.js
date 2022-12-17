const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'services';

const serviceSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits' },
    orderNumber: { type: Number, unique: true, required: true },
    serviceDate: { type: Schema.Types.Date },
    parts: [{ type: String }],
    fixes: [{ type: String, required: true }],
    price: { type: Number },
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
