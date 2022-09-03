import Joi, { string } from 'joi';


export const cardSchema = Joi.object({
    employeeId: Joi.number().required(),
    cardType: Joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required()
});

export const activateCardSchema = Joi.object({
    cardId: Joi.number().required(),
    cardCvv: Joi.string().min(3).max(3).required(),
    password: Joi.string().min(4).max(4).required()
});