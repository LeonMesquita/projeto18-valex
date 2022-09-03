import { Router } from "express";
import validateSchema from "../middlewares/validateSchema";
import * as cardSchema from "../schemas/cardSchema";
import rechargeSchema from "../schemas/rechargeSchema";
import * as cardsController from '../controllers/cardsController';

const cardsRouter = Router();

cardsRouter.post('/cards/create', validateSchema(cardSchema.cardSchema), cardsController.createCard);
cardsRouter.post('/cards/activate',validateSchema(cardSchema.activateCardSchema), cardsController.activateCard);
cardsRouter.get('/cards/transactions/:cardId', cardsController.viewTransactions);
cardsRouter.post('/cards/block', cardsController.blockCard);
cardsRouter.post('/cards/unblock', cardsController.unblockCard);
cardsRouter.post('/cards/recharge',validateSchema(rechargeSchema), cardsController.rechargeCard);




export default cardsRouter;