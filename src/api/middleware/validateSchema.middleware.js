const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((err) => ({
          message: err.message,
          path: err.path,
          // type: err.type,
        }));

        return res.status(400).json({
          success: false,
          errorCode: "VALIDATION_ERROR",
          errors,
        });
      }
      next();
    } catch (err) {
      // Log unexpected errors
      console.error("Unexpected error during validation:", err);
      return res.status(500).json({
        success: false,
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      });
    }
  };
};

module.exports = { validate };
