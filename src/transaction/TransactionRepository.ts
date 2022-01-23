import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Injectable } from '@nestjs/common';
import { AWSClient } from '../shared/aws';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { PinoLogger } from 'nestjs-pino';
import * as _ from 'lodash';

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

  public async batchSave(day: string, transactions: TransactionResponse[]): Promise<void> {
    const MAX_ITEMS_PET_BATCH = 25;
    const chunks: TransactionResponse[][] = _.chunk(transactions, MAX_ITEMS_PET_BATCH);

    await Promise.all(chunks.map(async (chunk) => {
      const putParams = chunk.map((transaction) => ({
        PutRequest: {
          Item: { ...transaction, day },
        },
      }));
      const params = {
        RequestItems: {
          [this.tableName]: putParams,
        },
      };

      await this.awsClient.getDyno(this.tableName).batchWriteItem(params).promise();
    }));

  }

  public async saveTransaction(day: string, transaction: TransactionResponse): Promise<AWS.DynamoDB.PutItemOutput> {
    const Item = { ...transaction, day };

    this.logger.info(`Saving transaction with hash ${transaction.hash} to DDB table...`);

    return this.awsClient.getDyno(this.tableName)
      .putItem({ Item, TableName: this.tableName, ReturnValues: 'NONE' })
      .promise();
  }
}
