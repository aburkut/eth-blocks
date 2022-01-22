import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { AWSClient } from '../shared/aws';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class BlockRepository {
  private readonly tableName: string;

  constructor(
    private readonly awsClient: AWSClient,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.tableName = this.configService.get<string>('BLOCKS_DDB_TABLE');
  }

  public async fetchBlockByDay(day: string): Promise<AWS.DynamoDB.ItemList> {
    return new Promise((resolve, reject) => this.awsClient.getDyno(this.tableName).query({
      Pages: Infinity,
      KeyConditionExpression: '#d = :d',
      ExpressionAttributeNames:{
        '#d': 'day',
      },
      ExpressionAttributeValues: {
        ':d': day,
      },
    },(err, data) => {
      if (err) return reject(err);
      return resolve(data.Items);
    }));
  }

  public async saveBlock(block): Promise<AWS.DynamoDB.PutItemOutput> {
    this.logger.info(`Saving block with number #${block.number} to DDB table...`);

    return this.awsClient.getDyno(this.tableName)
      .putItem({ Item: block, TableName: this.tableName, ReturnValues: 'NONE' })
      .promise();
  }
}
