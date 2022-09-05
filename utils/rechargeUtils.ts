import * as rechargeRepository from '../src/repositories/rechargeRepository';
import * as paymentRepository from '../src/repositories/paymentRepository';
import dayjs from 'dayjs';

export async function getRechargesAndBalance(cardId: any){
    const recharges = await rechargeRepository.findByCardId(cardId);
    const transactions = await paymentRepository.findByCardId(cardId);
    
    let balance: number = 0;
    let totalPaid: number = 0;

    const newRecharges: object[] = [];
    const newTransactions: object[] = []

    recharges.forEach(recharge => {
        balance += recharge.amount;
        newRecharges.push({...recharge,
        timestamp: dayjs(recharge.timestamp).format("DD/MM/YYYY")
        });
    });
    transactions.forEach(payment => {
        totalPaid += payment.amount;
        newTransactions.push({...payment,
            timestamp: dayjs(payment.timestamp).format("DD/MM/YYYY")
            });
    });


    balance -= totalPaid;
   
    return({
        balance,
        transactions: newTransactions,
        recharges: newRecharges
    });
}