import { Injectable } from '@nestjs/common';
import { AWSClient } from '../shared/aws';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { ethers } from 'ethers';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TransactionRepository {
  private readonly tableName: string;

  constructor(
    private readonly awsClient: AWSClient,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.tableName = this.configService.get<string>('TRANSACTIONS_DDB_TABLE');
  }

  public async saveTransaction(day: string, transaction: ethers.providers.TransactionResponse): Promise<AWS.DynamoDB.PutItemOutput> {
    const Item = { ...transaction, day };

    this.logger.info(`Saving transaction with hash ${transaction.hash} to DDB table...`)

    return this.awsClient.getDyno(this.tableName)
      .putItem({ Item, TableName: this.tableName, ReturnValues: 'NONE' })
      .promise();
  }
}
