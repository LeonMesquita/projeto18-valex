import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { throwError } from './throwError';
import * as cardRepository from '.././src/repositories/cardRepository';
import { checkDataExists } from './throwError';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');
import { faker } from '@faker-js/faker';



export async function getCardById(cardId: number){
    const card = await cardRepository.findById(cardId);
    checkDataExists(card, 'Card');
    return card;
}


export async function checkCardValidity(cardId: number){
    const card = await getCardById(cardId);
    if(card.password === null) throwError(401, 'The card is not active');
    checkIsExpired(card.expirationDate);
    return card;
}



export function validatePassword(cardPassword: string | undefined, password: string){
    if(!cardPassword) return throwError(401, 'The card is not activated');
    if(password !== cryptr.decrypt(cardPassword)) return throwError(401, 'Incorrect password');
}




export function checkIsExpired(expirationDate: string){
    const today = dayjs().format("MM/YYYY").split('/');
    const expiration = expirationDate.split('/');
    

    const month1 = Number(today[0]);
     const year1 = Number(today[1]);
    const month2 = Number(expiration[0]);
    const year2 = Number(expiration[1]);

    let isExpired: boolean;

    if(year1 > year2) isExpired = true;
    else if (month1 > month2 && year1 == year2) isExpired = true;
    else isExpired = false;

    if(isExpired){
        throwError(401, `The card is expired`);
    }
}



export function setHolderName(nameArr: string[]) :string{
    let cardholderName: string = nameArr[0];
    if(nameArr.length > 2){
        for(let count = 1; count < nameArr.length-1; count++){
            const word = nameArr[count];
            if(word.charAt(0) === word.charAt(0).toUpperCase()){
                cardholderName += ` ${word[0]}`
            }
        }
    }
    if(nameArr.length >= 2) cardholderName += ` ${nameArr[nameArr.length-1]}`;
    
     return cardholderName.toUpperCase();
}


export function generateCardCredentials(cardFlag: string){
    const number: string = faker.finance.creditCardNumber(cardFlag)
    const expirationDate: string =  `${dayjs().month()}/${dayjs().year()+5}`;
    const securityCode: string = cryptr.encrypt(faker.finance.creditCardCVV());

    const credentials = {
        number,
        expirationDate,
        securityCode
    }
    return credentials;
}


export function checkIsVirtual(isVirtual: boolean){
    if(isVirtual){
        return throwError(401, 'The card cannot be virtual');
    }
}