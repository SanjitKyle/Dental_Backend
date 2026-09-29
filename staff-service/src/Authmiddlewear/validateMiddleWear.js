const validate = (schema) => (req, res, next) => {
  // Use safeParse to avoid uncaught runtime exceptions crashing the app
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // result.error.flatten() formats errors cleanly for the client response
    return res.status(400).json({
      status: "fail",
      errors: result.error.flatten().fieldErrors
    });
  }

  // Assign the stripped/cleaned data back to req.body
  req.body = result.data;
  next();
};
