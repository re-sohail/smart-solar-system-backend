const successHandler = (req, res, next) => {
  res.sendSuccess = ({ message, data = null, statusCode = null || 200 }) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  next();
};

module.exports = successHandler;
