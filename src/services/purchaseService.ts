import * as paymentRepository from '../repositories/paymentRepository';
import * as purchaseUtils from '../../utils/purchaseUtils';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');


export async function makePurchase(cardId: number, password: string, businessId: number, amount: number){
   await purchaseUtils.validatePurchase(cardId, password, businessId, amount);
   await paymentRepository.insert({cardId, businessId, amount});
}


