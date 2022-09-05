import { Request, Response } from "express";
import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response){
    const cardBody: {employeeId: number , cardType: string} = req.body;
    try{
        const cvv = await cardService.createCard(req.headers['x-api-key'], cardBody.employeeId, cardBody.cardType);
        res.status(201).send(cvv);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}


export async function createVirtualCard(req: Request, res: Response){
    const cardBody: {originalId: number , password: string} = req.body;
    try{
        const cvv = await cardService.createVirtualCard(cardBody.originalId, cardBody.password);
        res.status(201).send(cvv);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}


export async function deleteVirtualCard(req: Request, res: Response){
    const cardBody: {cardId: number , password: string} = req.body;
    try{
       await cardService.deleteVirtualCard(cardBody.cardId, cardBody.password);
        res.sendStatus(200);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}





export async function activateCard(req: Request, res: Response){
    const cardBody: {cardId: number, cardCvv: string, password: string} = req.body;
    try{
        await cardService.activateCard(cardBody.cardId, cardBody.cardCvv, cardBody.password);
        res.sendStatus(201);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}




export async function viewTransactions(req: Request, res: Response){
    const cardId = req.params.cardId;
    try{
        const cardInfos = await cardService.viewTransactions(Number(cardId));

        res.status(200).send(cardInfos);

    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}




export async function blockCard(req: Request, res: Response){
    const cardBody: {cardId: number, password: string} = req.body;
    try{
        await cardService.blockAndUnblock(cardBody.cardId, cardBody.password, 'block');
        res.sendStatus(200);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}



export async function unblockCard(req: Request, res: Response){
    const cardBody: {cardId: number, password: string} = req.body;
    try{
        await cardService.blockAndUnblock(cardBody.cardId, cardBody.password, 'unblock');
        res.sendStatus(200);
    }catch(e: any){
        if(!e.code) return res.sendStatus(500);
        return res.status(e.code).send(e.message);
    }
}
