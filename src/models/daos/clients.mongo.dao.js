const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'clients';

const clientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number },
    refUnits: [{ type: Schema.Types.ObjectId, ref: 'refUnits' }],
    // bodyKits: [{ type: Schema.Types.ObjectId, ref: 'BodyKit' }],
    dateCreated: { type: Schema.Types.Date },
    dateUpdated: { type: Schema.Types.Date },
  },
  {
    timestamps: true,
  }
);

class ClientsMongoDao extends MongoContainer {
  constructor() {
    super(collection, clientSchema);
  }

  async addRefUnit(clientId, refUnitId) {
    const client = await this.model.findOne({ _id: clientId }, { __v: 0 });
    if (!client) {
      const message = `Client with id ${clientId} does not exist in our records.`;
      throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
    }
    const updatedClient = await this.model.updateOne(
      { _id: clientId },
      { $push: { refUnits: refUnitId } }
    );
    return updatedClient;
  }

  async removeRefUnit(clientId, refUnitId) {
    const client = await this.model.findOne({ _id: clientId }, { __v: 0 });
    if (!client) {
      const message = `Client with id ${clientId} does not exist in our records.`;
      throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
    }
    const updatedClient = await this.model.updateOne(
      { id: clientId },
      { $pull: { refUnits: refUnitId } }
    );
    return updatedClient;
  }
}

module.exports = ClientsMongoDao;
