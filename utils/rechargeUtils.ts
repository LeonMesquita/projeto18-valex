import * as rechargeRepository from '../src/repositories/rechargeRepository';
import * as paymentRepository from '../src/repositories/paymentRepository';


export async function getRechargesAndBalance(cardId: number){
    const recharges = await rechargeRepository.findByCardId(cardId);
    const transactions = await paymentRepository.findByCardId(cardId);
    
    let balance: number = 0;
    let totalPaid: number = 0;
    recharges.forEach(recharge => balance += recharge.amount);
    transactions.forEach(payment => totalPaid += payment.amount);

    balance -= totalPaid;
    console.log(balance)
    return({
        balance,
        transactions,
        recharges
    });
}