import Joi from 'joi';

import { emailRegexp } from '../constants/user.js';

export const authRegisterSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(3).max(20).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(3).max(20).required(),
});
