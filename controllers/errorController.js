/* eslint-disable no-console */
const mongoose = require('mongoose');

const AppError = require('../utils/appError');

const handleCastErrorDB = (err, res) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err, res) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid user data: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTErrorDB = () =>
  new AppError('Invalid token, please login again!', 401);

const handleJWTExpireErrorDB = () =>
  new AppError('Your token has expired, please login again!', 401);

const sendErrDev = (err, req, res) => {
  // A) API
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err: err,
    });
  }
  // B) Rendered website
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  // API
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // B) Programming or other unknown erroe: don't leak error details
    }
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Oooops, something is seriously shitted!',
    });
  }
  // B) Rendered website
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }
  // B) Programming or other unknown erroe: don't leak error details
  // 1) Log error
  console.error('ERROR', err);

  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err instanceof mongoose.Error.CastError)
      error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err instanceof mongoose.Error.ValidationError)
      error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTErrorDB();
    if (err.name === 'TokenExpiredError') error = handleJWTExpireErrorDB();

    sendErrProd(error, req, res);
  }
};
