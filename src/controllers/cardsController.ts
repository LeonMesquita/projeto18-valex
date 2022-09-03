import { Request, Response } from "express";
import { string } from "joi";
import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response){
    const cardBody: {employeeId: number | string , cardType: string} = req.body;
    try{
        await cardService.createCard(req.headers['x-api-key'], Number(cardBody.employeeId), cardBody.cardType);
        res.sendStatus(201);
    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
}


export async function activateCard(req: Request, res: Response){
    const cardBody: {cardId: number | string, cardCvv: string, password: string} = req.body;
    try{
        await cardService.activateCard(Number(cardBody.cardId), cardBody.cardCvv, cardBody.password);
        res.sendStatus(201);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}

///
////
/////
export async function viewTransactions(req: Request, res: Response){
    const cardId = req.params.cardId;
    try{
        await cardService.viewTransactions(Number(cardId));

        res.sendStatus(200);

    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}


export async function blockCard(req: Request, res: Response){
    const cardBody: {cardId: number | string, password: string} = req.body;
    try{
        await cardService.blockAndUnblock(Number(cardBody.cardId), cardBody.password, 'block');
        res.sendStatus(200);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}

export async function unblockCard(req: Request, res: Response){
    const cardBody: {cardId: number | string, password: string} = req.body;
    try{
        await cardService.blockAndUnblock(Number(cardBody.cardId), cardBody.password, 'unblock');
        res.sendStatus(200);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}


export async function rechargeCard(req: Request, res: Response){
    const recharge: {cardId: number | string, amount: number | string} = req.body;
    try{
        await cardService.rechargeCard(Number(recharge.cardId), Number(recharge.amount));
        res.sendStatus(201);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}