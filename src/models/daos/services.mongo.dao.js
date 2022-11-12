const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'services';

const serviceSchema = new Schema(
  {
    orderNumber: { type: String, unique: true },
    parts: [{ type: String }],
    fixes: [{ type: String }],
    price: { type: Number },
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits' },
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
