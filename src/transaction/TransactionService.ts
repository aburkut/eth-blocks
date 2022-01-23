import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './TransactionRepository';
import * as AWS from 'aws-sdk';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public saveTransaction(day: string, transaction): Promise<AWS.DynamoDB.PutItemOutput> {
    return this.transactionRepository.saveTransaction(day, transaction);
  }

  public saveTransactionsList(day: string, transactions): Promise<AWS.DynamoDB.ItemList> {
    return Promise.all(transactions.map((transaction) => {
      return this.saveTransaction(day, transaction);
    }));
  }
}
