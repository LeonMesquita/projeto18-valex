import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import throwError from '../../utils/throwError';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');
dayjs.extend(relativeTime)



export async function createCard(apiKey: any, employeeId: number, cardType: any){
    const company = await companyRepository.findByApiKey(apiKey);
    throwError(company, 'Company');
    const employee = await employeeRepository.findById(employeeId);
    throwError(employee, 'Employee');
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
    throwError(card, 'Card');
    const isExpired = compareDates(dayjs().format("MM/YYYY").split('/'), card.expirationDate.split('/'));
    if(isExpired){
        throw{
            code: 401,
            message: `The card is expired`
        }
    }
    else if (card.password !== null){
        throw{
            code: 401,
            message: `The card is already activated`
        }
    }
   

    const decryptedCvv = cryptr.decrypt(card.securityCode);
    if(cardCvv != decryptedCvv){
        throw{
            code: 401,
            message: `Incorrect security code`
        }
    }
    const encryptedPassword = cryptr.encrypt(password);

    await cardRepository.update(cardId, {password: encryptedPassword});

}



export async function viewTransactions(cardId: number){
    const card = await cardRepository.findById(cardId);
    console.log(card)
}





function compareDates(date1: string[], date2: string[]){
    const month1 = Number(date1[0]);
    const month2 = Number(date2[0]);
    const year1 = Number(date1[1]);
    const year2 = Number(date2[1]);

    if(year1 > year2) return true;
    else if (month1 > month2 && year1 == year2) return true;
    else return false

}





function setHolderName(nameArr: string[]) :string{
    let cardholderName: string = nameArr[0];
    if(nameArr.length > 2){
        for(let count = 1; count < nameArr.length-1; count++){
            const word = nameArr[count];
            if(word.charAt(0) === word.charAt(0).toUpperCase()){
                cardholderName += ` ${word[0]}`
            }
        }
    }
    cardholderName += ` ${nameArr[nameArr.length-1]}`;
     return cardholderName.toUpperCase();
}

