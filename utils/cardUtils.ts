import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { throwError } from './throwError';
import * as cardRepository from '.././src/repositories/cardRepository';
import { checkDataExists } from './throwError';


export async function checkCardValidity(cardId: number){
    const card = await cardRepository.findById(cardId);
    checkDataExists(card, 'Card');
    if(card.password === null) throwError(401, 'The card is not active');
    checkIsExpired(card.expirationDate);

    return card;
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
    cardholderName += ` ${nameArr[nameArr.length-1]}`;
     return cardholderName.toUpperCase();
}
