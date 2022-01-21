import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { BlockService } from '../block';
import { TransactionService } from '../transaction';
import { PinoLogger } from 'nestjs-pino';
import { StateService } from '../state';

@Injectable()
export class PullerService {
  constructor(
    private readonly blockService: BlockService,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
    private readonly stateService: StateService,
    private readonly logger: PinoLogger,
  ) {}

  public async pullBlocksWithTransactions(): Promise<void> {
    this.logger.info('Start pulling block...');

    const blockNumberFromState = await this.stateService.getState();
    const currentBlockNumber = blockNumberFromState + 1;

    await this.stateService.updateState(currentBlockNumber);

    const provider = new ethers.providers.EtherscanProvider(
      this.configService.get<string>('ETHERSCAN_NETWORK'),
      this.configService.get<string>('ETHERSCAN_API_KEY'),
    );

    const blockWithTransactions = await provider.getBlockWithTransactions(currentBlockNumber);
    const transactions = blockWithTransactions.transactions;

    const day = this.blockService.getDay(blockWithTransactions.timestamp);
    await this.blockService.saveBlock(blockWithTransactions);
    await this.transactionService.saveTransactionsList(day, transactions);

    this.logger.info(`Block with number ${blockWithTransactions.number} and ${transactions.length} transactions are saved in the database.`)
  }
}
