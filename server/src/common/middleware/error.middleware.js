const config = require('../../config/env');
const logger = require('../../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Format MongoDB/Mongoose specific errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map((el) => el.message).join(', ');
    } else if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid format for field ${error.path}`;
    } else if (error.code === 11000) {
      statusCode = 400;
      message = `Duplicate field value entered: ${Object.keys(error.keyValue).join(', ')}`;
    } else if (error.message === 'Request Timeout' || error.statusCode === 408) {
      statusCode = 408;
      message = 'The request timed out. This is usually due to a slow network connection, database latency, or external API (e.g. Cloudinary) response delay.';
    }

    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
