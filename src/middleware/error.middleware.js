const { errorResponse } = require('../utils/api.utils');
const HTTP_STATUS = require('../constants/api.constants');

const errorMiddleware = (error, req, res, next) => {
  const errorStatus = error.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  const errorMessage = error.message || 'There was an unexpected error';
  const errorDetails = error.message ? null : error;
  return res
    .status(errorStatus)
    .json(errorResponse(errorMessage, errorDetails));
};

const validateAdmin = (req, res, next) => {
  let isAdmin = true;
  if (!isAdmin) {
    res.json({ error: -1, message: 'Ruta no autorizada' });
    return;
  }
  next();
};

module.exports = errorMiddleware;
