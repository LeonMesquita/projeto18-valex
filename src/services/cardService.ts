import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import {throwError, checkDataExists} from '../../utils/throwError';
import { checkIsExpired, setHolderName, checkCardValidity } from '../../utils/cardUtils';
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
    const number: string = faker.finance.account();
    const cardholderName = setHolderName(employee.fullName.split(' '));
    const expirationDate =  `${dayjs().month()}/${dayjs().year()+5}`;
    const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());

    const cardData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type: cardType
    }
    cardRepository.insert(cardData);
}



export async function activateCard(cardId: number, cardCvv: string, password: string){
    const card = await cardRepository.findById(cardId);
    checkDataExists(card, 'Card');
    checkIsExpired(card.expirationDate);
    if (card.password !== null) throwError(401, `The card is already activated`);
    if(cardCvv != cryptr.decrypt(card.securityCode)) throwError(401, `Incorrect security code`);
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




export async function rechargeCard(apiKey: string, cardId: number, amount: number){
    const company = await companyUtils.checkCompanyByApiKey(apiKey);
    const card = await checkCardValidity(cardId);
    const employee = await companyUtils.checkIsCompanyEmployee(card.employeeId, company.id);
    await rechargeRepository.insert({cardId, amount});

}











