import { Request, Response } from "express";
import * as purchaseService from '../services/purchaseService';


export async function makePurchase(req: Request, res: Response){
    const purchase: {cardId: number, password: string, businessId: number, amount: number, purchaseType: string} = req.body; 
    try{
        await purchaseService.makePurchase(purchase.cardId, purchase.password, purchase.businessId, purchase.amount, purchase.purchaseType);
        res.sendStatus(201);
    }catch(e: any){
        if(!e.code) {
            console.log(e)
            return res.sendStatus(500);
        }
        return res.status(e.code).send(e.message);
    }
}

