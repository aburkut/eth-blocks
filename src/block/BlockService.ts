import { Injectable } from '@nestjs/common';
import { BlockRepository } from './BlockRepository';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

@Injectable()
export class BlockService {
  constructor(
    private readonly blockRepository: BlockRepository,
  ) {}

  public async saveBlock(block): Promise<AWS.DynamoDB.PutItemOutput> {
    const withoutTransactions = _.omit(block, [ 'transactions' ]);
    return this.blockRepository.saveBlock({ ...withoutTransactions, day: this.getDay(block.timestamp) });
  }

  public getDay(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-CA');
  }

  public async fetchBlocksByDay(day: string): Promise<AWS.DynamoDB.ItemList> {
    return this.blockRepository.fetchBlocksByDay(day);
  }
}
