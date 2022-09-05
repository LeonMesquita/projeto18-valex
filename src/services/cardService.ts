import * as cardRepository from '../repositories/cardRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import {throwError, checkDataExists} from '../../utils/throwError';
import { checkIsExpired, setHolderName, checkCardValidity, getCardById, validatePassword, generateCardCredentials } from '../../utils/cardUtils';
import * as cardUtils from '../../utils/cardUtils';
import { getRechargesAndBalance } from '../../utils/rechargeUtils';
import * as companyUtils from '../../utils/companyUtils';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');



export async function createCard(apiKey: any, employeeId: number, cardType: any){
    const company = await companyUtils.checkCompanyByApiKey(apiKey);
    const employee = await employeeRepository.findById(employeeId);
    checkDataExists(employee, 'Employee');
    const cardholderName = setHolderName(employee.fullName.split(' '));
    const cardCredentials = generateCardCredentials();

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
}







export async function createVirtualCard(originalId: number, password: string){
    const originalCard = await getCardById(originalId);
    validatePassword(originalCard.password, password);
    const cardCredentials = generateCardCredentials();
    const virtualCard = {
        ...originalCard,
        number: cardCredentials.number,
        securityCode: cardCredentials.securityCode,
        expirationDate: cardCredentials.expirationDate,
        isVirtual: true,
        originalCardId: originalId
    }
    cardRepository.insert(virtualCard);
}


export async function deleteVirtualCard(cardId: number, password: string){
    const card = await getCardById(cardId);
    validatePassword(card.password, password);
    if(!card.isVirtual) return throwError(401, 'The card must be virtual');
    await cardRepository.remove(cardId);
}






export async function activateCard(cardId: number, cardCvv: string, password: string){
    if(password.length !== 4 || !Number(password)) throwError(400, 'Invalid password');
    const card = await getCardById(cardId);
    checkIsExpired(card.expirationDate);
    cardUtils.checkIsVirtual(card.isVirtual);
    if (card.password !== null) return throwError(401, `The card is already activated`);
    if(cardCvv != cryptr.decrypt(card.securityCode)) return throwError(401, `Incorrect security code`);
    const encryptedPassword = cryptr.encrypt(password);
    await cardRepository.update(cardId, {password: encryptedPassword});
}



export async function viewTransactions(cardId: number){
    const card = await cardRepository.findById(cardId);
    const cardInfos = await getRechargesAndBalance(cardId);
    console.log(cardInfos)
    return cardInfos;
}



export async function blockAndUnblock(cardId: number, password: string, operation: string){
    const card = await cardRepository.findById(cardId);
    const cardPassword = card.password || null;
    checkDataExists(card, 'Card');
    checkIsExpired(card.expirationDate);
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




export async function rechargeCard(apiKey: any, cardId: number, amount: number){
    const company = await companyUtils.checkCompanyByApiKey(apiKey);
    const card = await checkCardValidity(cardId);
    checkIsExpired(card.expirationDate);
    cardUtils.checkIsVirtual(card.isVirtual);
    const employee = await companyUtils.checkIsCompanyEmployee(card.employeeId, company.id);
    await rechargeRepository.insert({cardId, amount});
}











