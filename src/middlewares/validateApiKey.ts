import { Request, Response, NextFunction } from "express";
import { throwError } from "../../utils/throwError";

export async function validateApiKey(req: Request, res: Response, next: NextFunction){
    try{
        const apiKey = req.headers['x-api-key'];
        if(!apiKey) throwError(401, 'Api Key is required');
    }catch(e: any){
        return res.status(e.code).send(e.message);
    }

    next();
}