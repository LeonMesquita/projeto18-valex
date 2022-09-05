import { Request, Response } from "express";
import * as rechargeService from '../services/rechargeService';

export async function rechargeCard(req: Request, res: Response){
    const recharge: {cardId: number, amount: number} = req.body;
    try{
        await rechargeService.rechargeCard(req.headers['x-api-key'], recharge.cardId, recharge.amount);
        res.sendStatus(201);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}