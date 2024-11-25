const { errorResponse } = require('../utils/api.utils');
const HTTP_STATUS = require('../constants/api.constants');
const mongoose = require('mongoose');

const errorMiddleware = (error, req, res, next) => {
  //   const errorStatus = error.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  const errorStatus = error.statusCode || 500;
  const errorMessage = error.message || 'There was an unexpected error';
  const errorDetails = error.message ? null : error;

  console.log('ERROR!!!', error);

  if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
    res.status(HTTP_STATUS.BAD_REQUEST).render('pages/error', {
      message: 'La ID ingresada no es válida.',
      details: 'Verificá que el enlace sea correcto.',
    });
  } else {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .render('pages/error', { message: errorMessage, details: errorDetails });
  }

  //   return res.status(errorStatus).json(errorResponse(errorMessage, errorDetails));
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
