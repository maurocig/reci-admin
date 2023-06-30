const mongoose = require('mongoose');
const dbConfig = require('../../DB/db.config');

const { HttpError } = require('../../utils/api.utils');
const { HTTP_STATUS } = require('../../constants/api.constants');

class MongoContainer {
  constructor(collection, schema) {
    this.model = mongoose.model(collection, schema);
  }

  static async connect() {
    await mongoose.connect(dbConfig.mongodb.uri);
  }

  static async disconnect() {
    await mongoose.disconnect();
  }

  async getAll(filter = {}) {
    const documents = await this.model.find(filter, { __v: 0 }).lean();
    return documents;
  }

  async getById(id) {
    const document = await this.model.findOne({ _id: id }, { __v: 0 }).lean();
    if (!document) {
      const message = `Resource with id ${id} does not exist in our records.`;
      throw new HttpError(404, message);
    }
    return document;
  }

  async save(item) {
    const newDocument = new this.model({
      _id: new mongoose.Types.ObjectId(),
      ...item,
    });
    console.log(newDocument);
    await newDocument.save();
    return await newDocument._id.toString();
  }

  async update(id, item) {
    const updatedDocument = await this.model.updateOne({ _id: id }, { $set: { ...item } });
    if (!updatedDocument.matchedCount) {
      const message = `Resource with id ${id} does not exist in our records.`;
      throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
    }
    return updatedDocument;
  }

  async delete(id) {
    return await this.model.deleteOne({ _id: id }); // este método tira un error, por lo que no es necesario agregar nada.
  }

  async find(filter = {}, collectionRef = '') {
    const documents = await this.model.find(filter, { __v: 0 }).populate(collectionRef).lean();
    return documents;
  }
}

module.exports = MongoContainer;
