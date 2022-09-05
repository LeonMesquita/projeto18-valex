import Joi from "joi";

const purchaseSchema = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().required(),
    businessId: Joi.number(),
    amount: Joi.number().min(1).required(),
    purchaseType: Joi.string().valid('POS', 'online').required()
});


export default purchaseSchema;