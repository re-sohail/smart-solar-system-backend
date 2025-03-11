const errorHandler = (req, res, next) => {
  res.sendError = ({ message, statusCode = null || 500, error }) => {
    res.status(statusCode).json({
      success: false,
      data: null,
      message,
      error: error || null,
    });
  };

  next();
};

module.exports = errorHandler;
