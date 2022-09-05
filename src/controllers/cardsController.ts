import { Request, Response } from "express";
import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response){
    const cardBody: {employeeId: number , cardType: string} = req.body;
    const cvv = await cardService.createCard(req.headers['x-api-key'], cardBody.employeeId, cardBody.cardType);
    res.status(201).send(cvv);
}


export async function createVirtualCard(req: Request, res: Response){
    const cardBody: {originalId: number , password: string} = req.body;
    const cvv = await cardService.createVirtualCard(cardBody.originalId, cardBody.password);
    res.status(201).send(cvv);
}


export async function deleteVirtualCard(req: Request, res: Response){
    const cardBody: {cardId: number , password: string} = req.body;
    await cardService.deleteVirtualCard(cardBody.cardId, cardBody.password);
    res.sendStatus(200);
}





export async function activateCard(req: Request, res: Response){
    const cardBody: {cardId: number, cardCvv: string, password: string} = req.body;
    await cardService.activateCard(cardBody.cardId, cardBody.cardCvv, cardBody.password);
    res.sendStatus(201);
}




export async function viewTransactions(req: Request, res: Response){
    const cardId = req.params.cardId;
    const cardInfos = await cardService.viewTransactions(Number(cardId));
    res.status(200).send(cardInfos);
}




export async function blockCard(req: Request, res: Response){
    const cardBody: {cardId: number, password: string} = req.body;
    await cardService.blockAndUnblock(cardBody.cardId, cardBody.password, 'block');
    res.sendStatus(200);
}



export async function unblockCard(req: Request, res: Response){
    const cardBody: {cardId: number, password: string} = req.body;
    await cardService.blockAndUnblock(cardBody.cardId, cardBody.password, 'unblock');
    res.sendStatus(200);
}
