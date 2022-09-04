import Joi from "joi";

const rechargeSchema = Joi.object({
    apiKey: Joi.string().required(),
    cardId: Joi.number().required(),
    amount: Joi.number().min(1).required()
});


export default rechargeSchema;