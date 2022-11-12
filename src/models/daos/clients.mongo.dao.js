const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'clients';

const clientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    refUnits: [{ type: Schema.Types.ObjectId, ref: 'refUnits' }],
    // bodyKits: [{ type: Schema.Types.ObjectId, ref: 'BodyKit' }],
  },
  {
    timestamps: true,
  }
);

class ClientsMongoDao extends MongoContainer {
  constructor() {
    super(collection, clientSchema);
  }
}

module.exports = ClientsMongoDao;
