const successHandler = (req, res, next) => {
  res.sendSuccess = ({
    message,
    data = null,
    statusCode = null || 200,
    meta,
  }) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: meta || null,
    });
  };

  next();
};

module.exports = successHandler;
