import * as paymentRepository from '../repositories/paymentRepository';
import * as cardUtils from '../../utils/cardUtils';
import * as rechargeUtils from '../../utils/rechargeUtils';
import * as businessRepository from '../repositories/businessRepository';
import { throwError,checkDataExists } from '../../utils/throwError';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');


export async function makePurchase(cardId: number, password: string, businessId: number, amount: number, purchaseType: string){
   
   const card = await cardUtils.checkCardValidity(cardId);
   const originalId: number = purchaseType === "POS" ? cardId : card.originalCardId!;
   if(card.isBlocked) throwError(401, 'The card is blocked');
   cardUtils.validatePassword(card.password, password);
   if(purchaseType === "POS"){
       cardUtils.checkIsVirtual(card.isVirtual);
   }

   const business = await businessRepository.findById(businessId);
   checkDataExists(business, 'Business');
   if(business.type !== card.type) throwError(401, 'Invalid type of business');

   

   const cardInfo = await rechargeUtils.getRechargesAndBalance(originalId);
   if(cardInfo.balance < amount) throwError(401, 'Insufficient balance');

   await paymentRepository.insert({cardId: originalId, businessId, amount});
}