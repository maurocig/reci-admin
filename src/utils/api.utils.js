const successResponse = (
  data,
  message = 'Operación realizada exitosamente.'
) => {
  return {
    success: true,
    message,
    data,
  };
};

const errorResponse = (message, details = null) => {
  return {
    success: false,
    message,
    details,
  };
};

class HttpError {
  constructor(status, message, details) {
    this.statusCode = status;
    this.message = message;
    this.details = details;
  }
}

module.exports = {
  successResponse,
  errorResponse,
  HttpError,
};
