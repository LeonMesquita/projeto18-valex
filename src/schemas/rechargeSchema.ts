import Joi from "joi";

const rechargeSchema = Joi.object({
    cardId: Joi.number().required(),
    amount: Joi.number().min(1).required()
});


export default rechargeSchema;