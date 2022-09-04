import { Router } from "express";
import cardsRouter from "./cardsRouter";
import purchaseRouter from "./purchaseRouter";

const router = Router();

router.use(cardsRouter);
router.use(purchaseRouter);


export default router;