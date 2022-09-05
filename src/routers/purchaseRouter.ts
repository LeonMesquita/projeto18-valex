import { Router } from "express";
import validateSchema from "../middlewares/validateSchema";
import * as purchaseController from '../controllers/purchaseController';
import purchaseSchema from "../schemas/purchaseSchema";


const purchaseRouter = Router();

purchaseRouter.post('/purchases',validateSchema(purchaseSchema), purchaseController.makePurchase);


export default purchaseRouter;