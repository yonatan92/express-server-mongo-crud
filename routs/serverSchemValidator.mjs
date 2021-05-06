import Joi from 'joi';
export const postSchema = Joi.object({
  first_name: Joi.string().alphanum().min(2).max(30).required(),
  last_name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().length(10).regex(/^\d+$/).required(),
  country: Joi.string().alphanum().min(2).required(),
});

export const putSchema = Joi.object({
  first_name: Joi.string().alphanum().min(2).max(30).required(),
  last_name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().length(10).regex(/^\d+$/).required(),
  country: Joi.string().alphanum().min(2).required(),
});

export const patchSchema = Joi.object({
  first_name: Joi.string().alphanum().min(2).max(30),
  last_name: Joi.string().alphanum().min(2).max(30),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().length(10).regex(/^\d+$/),
});

export const postManyhSchema = Joi.array().items(postSchema);
