import { Request, Response } from "express";
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