
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as cardUtils from '../../utils/cardUtils';
import * as companyUtils from '../../utils/companyUtils';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('myTotallySecretKey');


export async function rechargeCard(apiKey: any, cardId: number, amount: number){
    const company = await companyUtils.checkCompanyByApiKey(apiKey);
    const card = await cardUtils.checkCardValidity(cardId);
    cardUtils.checkIsExpired(card.expirationDate);
    cardUtils.checkIsVirtual(card.isVirtual);
    const employee = await companyUtils.checkIsCompanyEmployee(card.employeeId, company.id);
    await rechargeRepository.insert({cardId, amount});
}