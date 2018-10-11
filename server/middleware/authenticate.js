const { User } = require("../models/User");

const createErrorObject = errors => {
  const errorObject = {};
  errors.forEach(error => {
    errorObject[error.param] = error.msg;
  });

  return errorObject;
};

const checkRegistrationFields = (req, res, next) => {
  req.check("email").isEmail();
  req
    .check("username")
    .isString()
    .isLength({ min: 5, max: 15 })
    .withMessage("Username must be between 5 and 15 characters");
  req
    .check("password")
    .isString()
    .isLength({ min: 5, max: 15 })
    .withMessage("Password must be between 5 and 15 characters");

  const errors = req.validationErrors();

  if (errors) {
    res.send({
      errors: createErrorObject(errors)
    });
  } else {
    next();
  }
};

const checkLoginFields = async (req, res, next) => {
  let errors = [];
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    errors.push({ param: "email", msg: "No User Found with that email" });
  }
  if (!(await user.isValidPassword(req.body.password))) {
    errors.push({ param: "password", msg: "Password doesn't match" });
  }
  if (errors.length !== 0) {
    res.send({
      errors: createErrorObject(errors)
    });
  } else {
    next();
  }
};

module.exports = { checkLoginFields, checkRegistrationFields };