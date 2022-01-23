import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './TransactionRepository';
import * as AWS from 'aws-sdk';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public async saveTransaction(day: string, transaction: TransactionResponse): Promise<AWS.DynamoDB.PutItemOutput> {
    return this.transactionRepository.saveTransaction(day, transaction);
  }

  public async saveTransactionsList(day: string, transactions: TransactionResponse[]): Promise<void> {
    await this.transactionRepository.batchSave(day, transactions);
  }
}
