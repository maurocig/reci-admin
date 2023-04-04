const HTTP_STATUS = require('../constants/api.constants');
const UsersDao = require('../models/daos/users/users.mongo.dao');
const { successResponse } = require('../utils/api.utils');
const Mongoose = require('mongoose');

const UsersModel = new UsersDao();

class UsersController {
  async getUsers(req, res, next) {
    try {
      const users = await usersDao.getAll();
      const response = successResponse(users);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await usersDao.getById(id);
      const response = successResponse(user);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async saveUser(req, res, next) {
    try {
      const user = {
        _id: Mongoose.Types.ObjectId(),
        timestamp: new Date(),
        ...req.body,
      };
      await usersDao.save(user);
      const response = successResponse(user);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    const { id } = req.params;
    try {
      const updatedUser = {
        id,
        ...req.body,
      };
      await usersDao.update(id, req.body);
      const response = successResponse(updatedUser);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    const { id } = req.params;
    try {
      const deletedUser = await usersDao.delete(id);
      const response = successResponse(deletedUser);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserData(req, res, next) {
    try {
      const user = await UsersModel.getByEmail(req.user.email);
      return res.json(successResponse(user));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new UsersController();
