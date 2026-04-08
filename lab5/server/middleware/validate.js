function validateRequiredFields(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return typeof value !== 'string' || !value.trim();
    });

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    return next();
  };
}

module.exports = { validateRequiredFields };

