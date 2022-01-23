import { Injectable } from '@nestjs/common';
import { BlockWithTransactions } from '@ethersproject/abstract-provider';
import { BlockRepository } from './BlockRepository';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

@Injectable()
export class BlockService {
  constructor(
    private readonly blockRepository: BlockRepository,
  ) {}

  public async saveBlock(block: BlockWithTransactions): Promise<AWS.DynamoDB.PutItemOutput> {
    const withoutTransactions = _.omit(block, [ 'transactions' ]);
    const day = this.getDay(block.timestamp);
    return this.blockRepository.saveBlock({ ...withoutTransactions }, day);
  }

  public getDay(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-CA');
  }

  public async fetchBlocksByDay(day: string): Promise<AWS.DynamoDB.ItemList> {
    return this.blockRepository.fetchBlocksByDay(day);
  }
}
