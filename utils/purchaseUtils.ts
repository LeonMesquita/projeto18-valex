import { checkCardValidity } from "./cardUtils";
import * as businessRepository from '../src/repositories/businessRepository';
import { throwError, checkDataExists } from "./throwError";
import * as rechargeUtils from './rechargeUtils';
import Cryptr from 'cryptr';

const cryptr = new Cryptr("myTotallySecretKey");

export async function validatePurchase(cardId: number, password: string, businessId: number, amount: number){
    const card = await checkCardValidity(cardId);
    if(card.isBlocked) throwError(401, 'The card is blocked');
     if(card.password && password !== cryptr.decrypt(card.password)){
        throwError(401, 'The password is incorrect');
    }
    const business = await businessRepository.findById(businessId);
    checkDataExists(business, 'Business');
    if(business.type !== card.type) throwError(401, 'Invalid type of business');
    const cardInfo = await rechargeUtils.getRechargesAndBalance(cardId);
    console.log(cardInfo)
    if(cardInfo.balance < amount) throwError(401, 'Insufficient balance');
    
}