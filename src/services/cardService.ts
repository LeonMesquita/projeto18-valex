import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import throwError from '../../utils/throwError';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs'
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');


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

