import { Request, Response, NextFunction } from "express";

export default  function errorHandler(error: any, req: Request, res: Response, next: NextFunction){
    if(!error.code){
        return res.sendStatus(500);
    }
    return res.status(error.code).send(error.message);  
}
