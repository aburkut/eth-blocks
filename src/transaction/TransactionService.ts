import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './TransactionRepository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public saveTransaction(day: string, transaction) {
    return this.transactionRepository.saveTransaction(day, transaction);
  }

  public saveTransactionsList(day: string, transactions) {
    return Promise.all(transactions.map((transaction) => {
      return this.saveTransaction(day, transaction);
    }))
  }
}
