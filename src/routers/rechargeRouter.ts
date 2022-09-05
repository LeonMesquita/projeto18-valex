import { Router } from "express";
import validateSchema from "../middlewares/validateSchema";
import { validateApiKey } from "../middlewares/validateApiKey";
import rechargeSchema from "../schemas/rechargeSchema";
import * as rechargeController from '../controllers/rechargeController';

const rechargeRouter = Router();


rechargeRouter.post('/cards/recharge',validateApiKey, validateSchema(rechargeSchema), rechargeController.rechargeCard);




export default rechargeRouter;