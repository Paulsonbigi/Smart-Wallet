import * as Joi from "joi";
const pattern = "^(?=[0-9a-zA-Z#@\$\?]{8,}$)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9]).*";


export const registerUserSchema = Joi.object().keys({
    firstName: Joi.string().trim().required().messages({
        "string.base": `"First name" should be of type 'string'`,
        "string.empty": `"First aame" cannot be an empty string`,
      }),
    lastName: Joi.string().trim().required().messages({
        "string.base": `"First name" should be of type 'string'`,
        "string.empty": `"First aame" cannot be an empty string`,
      }),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
		'string.base': `email should be a type of 'email'`,
		'any.required': `"email" is a required field`,
	}),
    password: Joi.string().trim().regex(RegExp(pattern)).min(8).max(20).required().messages({
		'string.base': `"password" should be a type of 'text'`,
		'any.required': `"password" is a required field`,
	}),
}).options({ abortEarly: false, allowUnknown: true });


export const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'string.base': `email should be a type of 'email'`,
    'any.required': `"email" is a required field`,
  }),
  password: Joi.string().trim().regex(RegExp(pattern)).min(8).max(20).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'any.required': `"password" is a required field`,
  }),
}).options({ abortEarly: false, allowUnknown: true });