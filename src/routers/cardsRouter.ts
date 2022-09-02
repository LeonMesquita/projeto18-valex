import { Router } from "express";
import validateSchema from "../middlewares/validateSchema";
import cardSchema from "../schemas/cardSchema";
import * as cardsController from '../controllers/cardsController';

const cardsRouter = Router();

cardsRouter.post('/cards/create', validateSchema(cardSchema), cardsController.createCard);



export default cardsRouter;