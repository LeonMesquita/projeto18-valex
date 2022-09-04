import { Router } from "express";
import validateSchema from "../middlewares/validateSchema";
import * as purchaseController from '../controllers/purchaseController';


const purchaseRouter = Router();

purchaseRouter.post('/purchases', purchaseController.makePurchase);


export default purchaseRouter;