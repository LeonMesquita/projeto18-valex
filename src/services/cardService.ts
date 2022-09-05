import * as cardRepository from '../repositories/cardRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import {throwError, checkDataExists} from '../../utils/throwError';
import * as cardUtils from '../../utils/cardUtils';
import { getRechargesAndBalance } from '../../utils/rechargeUtils';
import * as companyUtils from '../../utils/companyUtils';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');



export async function createCard(apiKey: any, employeeId: number, cardType: any){    
    const company = await companyUtils.checkCompanyByApiKey(apiKey);
    const employee = await employeeRepository.findById(employeeId);
    checkDataExists(employee, 'Employee');
    const cardholderName = cardUtils.setHolderName(employee.fullName.split(' '));
    const cardCredentials = cardUtils.generateCardCredentials('');

    const cardData = {
        employeeId,
        number: cardCredentials.number,
        cardholderName,
        securityCode: cardCredentials.securityCode,
        expirationDate: cardCredentials.expirationDate,
        isVirtual: false,
        isBlocked: false,
        type: cardType
    }
    cardRepository.insert(cardData);

    return({
        cvv: cryptr.decrypt(cardCredentials.securityCode)
    });
}




export async function createVirtualCard(originalId: number, password: string){
    const originalCard = await cardUtils.getCardById(originalId);
    if(originalCard.isVirtual) return throwError(401, 'The original card cannot be virtual');
    cardUtils.validatePassword(originalCard.password, password);
    const cardCredentials = cardUtils.generateCardCredentials('mastercard');
    const virtualCard = {
        ...originalCard,
        number: cardCredentials.number,
        securityCode: cardCredentials.securityCode,
        expirationDate: cardCredentials.expirationDate,
        isVirtual: true,
        originalCardId: originalId
    }
    cardRepository.insert(virtualCard);

    return({
        cvv: cryptr.decrypt(cardCredentials.securityCode)
    });
}




export async function deleteVirtualCard(cardId: number, password: string){
    const card = await cardUtils.getCardById(cardId);
    cardUtils.validatePassword(card.password, password);
    if(!card.isVirtual) return throwError(401, 'The card must be virtual');
    await rechargeRepository.deleteRecharges(cardId);
    await paymentRepository.deletePayments(cardId);
    await cardRepository.remove(card.id);
}




export async function activateCard(cardId: number, cardCvv: string, password: string){
    if(password.length !== 4 || !Number(password)) throwError(400, 'Invalid password');
    const card = await cardUtils.getCardById(cardId);
    cardUtils.checkIsExpired(card.expirationDate);
    cardUtils.checkIsVirtual(card.isVirtual);
    if (card.password !== null) return throwError(401, `The card is already activated`);
    if(cardCvv != cryptr.decrypt(card.securityCode)) return throwError(401, `Incorrect security code`);
    const encryptedPassword = cryptr.encrypt(password);
    await cardRepository.update(cardId, {password: encryptedPassword});
}



export async function viewTransactions(cardId: number){
    const card = await cardUtils.getCardById(cardId);
    const cardInfos = await getRechargesAndBalance(cardId);
    console.log(cardInfos)
    return cardInfos;
}



export async function blockAndUnblock(cardId: number, password: string, operation: string){
    const card = await cardRepository.findById(cardId);
    const cardPassword = card.password || null;
    checkDataExists(card, 'Card');
    cardUtils.checkIsExpired(card.expirationDate);
    if(operation === 'block' && card.isBlocked) throwError(409, `The card is already blocked`);
    else if (operation === 'unblock' && !card.isBlocked) throwError(409, `The card is already unblocked`);
    
    if(cardPassword === null) {
        throwError(401, `The card is not activated`);
        return;
    }
    const decryptedPassword = cryptr.decrypt(cardPassword);
    if(decryptedPassword != password) throwError(401, `The password is incorrect`);

    await cardRepository.update(cardId, {isBlocked: !card.isBlocked});
}











