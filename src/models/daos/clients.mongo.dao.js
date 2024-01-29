const { Schema } = require('mongoose');
const MongoContainer = require('../containers/mongo.container');

const collection = 'clients';

const clientSchema = new Schema(
  {
    name: { type: String, uppercase: true, required: true, unique: true, index: 'text' },
    email: { type: String, lowercase: true, required: false, unique: true },
    phone: { type: String || null, required: false },
    clientNumber: { type: Number, required: true, unique: true },
    contactPerson: { type: String, uppercase: true, required: false },
    brandName: { type: String, uppercase: true, required: false, unique: true, index: 'text' },
    refUnits: [{ type: Schema.Types.ObjectId, ref: 'refUnits' }],
    bodyKits: [{ type: Schema.Types.ObjectId, ref: 'BodyKit' }],
  },
  {
    timestamps: true,
  }
);
clientSchema.index({ '$**': 'text' });

class ClientsMongoDao extends MongoContainer {
  constructor() {
    super(collection, clientSchema);
  }

  async getAllSorted() {
    const clients = await this.model.find().sort({ name: 1 }).lean();
    return clients;
  }

  async addRefUnit(clientId, refUnitId) {
    const client = await this.model.findOne({ _id: clientId }, { __v: 0 });
    if (!client) {
      const message = `Client with id ${clientId} does not exist in our records.`;
      throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
    }
    const updatedClient = await this.model.updateOne(
      { _id: clientId },
      { $addToSet: { refUnits: refUnitId } } // no agrega duplicados pero no da error :/
    );
    return updatedClient;
  }

  async removeRefUnit(clientId, refUnitId) {
    const client = await this.model.findOne({ _id: clientId }, { __v: 0 });
    if (client) {
      const updatedClient = await this.model.updateOne(
        { _id: clientId },
        { $pull: { refUnits: refUnitId } }
      );
      return updatedClient;
    } else {
      return;
    }
  }
}

module.exports = ClientsMongoDao;
