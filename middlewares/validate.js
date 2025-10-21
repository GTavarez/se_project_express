const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
      "string.empty": "Name is required",
    }),
    weather: Joi.string().required().messages({
      "string.empty": "Weather is required",
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": "Image URL is required",
      "any.custom": "Invalid URL format",
    }),
  }),
});
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
      "string.empty": "Name is required",
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": "Avatar URL is required",
      "any.custom": "Invalid URL format",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
  }),
});
module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
  }),
});
module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": "Item ID must be 24 characters long",
      "string.hex": "Item ID must be a valid hexadecimal",
      "string.empty": "Item ID is required",
    }),
  }),
});
module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.length": "User ID must be 24 characters long",
      "string.hex": "User ID must be a valid hexadecimal",
      "string.empty": "User ID is required",
    }),
  }),
});
module.exports.validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),
    avatar: Joi.string().custom(validateUrl).messages({
      "any.custom": "Invalid URL format",
    }),
  }),
});
