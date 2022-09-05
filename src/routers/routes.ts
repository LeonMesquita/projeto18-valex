import { Router } from "express";
import cardsRouter from "./cardsRouter";
import purchaseRouter from "./purchaseRouter";
import rechargeRouter from "./rechargeRouter";

const router = Router();

router.use(cardsRouter);
router.use(purchaseRouter);
router.use(rechargeRouter);


export default router;