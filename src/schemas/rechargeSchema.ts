import Joi from "joi";

const rechargeSchema = Joi.object({
    cardId: Joi.number().required(),
    amount: Joi.number().integer().min(1).required()
});

export default rechargeSchema;