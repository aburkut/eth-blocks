import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { BlockService } from '../block';
import { TransactionService } from '../transaction';
import { PinoLogger } from 'nestjs-pino';
import { StateService } from '../state';
import { isEmpty }  from 'lodash';

@Injectable()
export class PullerService {
  constructor(
    private readonly blockService: BlockService,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
    private readonly stateService: StateService,
    private readonly logger: PinoLogger,
  ) {}

  private async getBlockWithTransactions(blockNumber: number) {
    const provider = new ethers.providers.EtherscanProvider(
      this.configService.get<string>('ETHERSCAN_NETWORK'),
      this.configService.get<string>('ETHERSCAN_API_KEY'),
    );

    const blockWithTransactions = await provider.getBlockWithTransactions(blockNumber);

    return blockWithTransactions;
  }

  public async pullBlocksWithTransactions(): Promise<void> {
    this.logger.info('Start pulling block...');

    const blockNumberFromState = await this.stateService.getState();
    let currentBlockNumber = blockNumberFromState + 1;

    const MAX_BLOCKS_LIMIT = 100;
    let block = await this.getBlockWithTransactions(currentBlockNumber);
    let counter = 0;

    while (! isEmpty(block) && counter <= MAX_BLOCKS_LIMIT) {
      counter++;
      this.logger.info(`Found block with number ${block.number}...`);
      const transactions = block.transactions;

      await this.stateService.updateState(currentBlockNumber);

      const day = this.blockService.getDay(block.timestamp);
      await this.blockService.saveBlock(block);
      await this.transactionService.saveTransactionsList(day, transactions);

      this.logger.info(`Block with number ${block.number} and ${transactions.length} transactions are saved in the database.`);

      await this.stateService.updateState(currentBlockNumber);
      currentBlockNumber++;
      block = await this.getBlockWithTransactions(currentBlockNumber);
    }
  }
}
