const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'refUnits';

const refUnitSchema = new Schema(
  {
    serialNumber: { type: String, unique: true },
    model: { type: String },
    services: [{ type: Schema.Types.ObjectId, ref: 'services' }],
    hours: { type: Number },
    client: { type: Schema.Types.ObjectId, ref: 'clients' },
    plate: { type: String },
    soldByReci: { type: Schema.Types.Boolean },
  },
  {
    timestamps: true,
  }
);

class RefUnitsMongoDao extends MongoContainer {
  constructor() {
    super(collection, refUnitSchema);
  }
}

module.exports = RefUnitsMongoDao;
