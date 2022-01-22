import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, ethers } from 'ethers';
import { PinoLogger } from 'nestjs-pino';
import { BlockService } from '../block';
import * as abi from '../abi.json';

@Injectable()
export class CalcService {
  constructor(
    private readonly blockService: BlockService,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}

  private async calcBlocksAndFees(day: string): Promise<[ number, BigNumber ]> {
    const blocks = await this.blockService.fetchBlockByDay(day);
    const count = blocks.length;

    const totalGasUsed = blocks.reduce((memo, block) => {
      return memo.add(BigNumber.from(block.gasUsed));
    },  ethers.constants.Zero);

    return [ count, totalGasUsed ];
  }

  private getDayToProcess(): string {
    const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-CA');
    return oneDayAgo;
  }

  public async process(): Promise<void> {
    const day = this.getDayToProcess();
    this.logger.info(`Start calculating total number of blocks and ETH spent on gas fees for ${day}`);

    const [ count, totalGasUsed ] = await this.calcBlocksAndFees(day);
    this.logger.info(`Total number of blocks: ${count}`);
    this.logger.info(`ETH spent on gas fees: ${ethers.utils.formatEther(totalGasUsed)}`);

    const provider = ethers.getDefaultProvider(this.configService.get<string>('SMART_CONTRACT_NETWORK'));
    const contractAddress = this.configService.get<string>('SMART_CONTRACT_ADDRESS');
    const wallet = new ethers.Wallet(this.configService.get<string>('PRIVATE_KEY'), provider);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    this.logger.info(`Smart contract address: ${contract.address}`);

    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.setDay(day, count, totalGasUsed.toHexString());

    this.logger.info(`TX Hash: ${tx.hash}`);

    await tx.wait();

    const days = await contract.getDays();

    this.logger.info(`Days in contracts: ${days.join(', ')}`);

    const value = await contract.dayMapping(day);

    this.logger.info(`Blocks number from smart contract: ${BigNumber.from(value[0]).toNumber()}`);
    this.logger.info(`ETH spent from smart contract: ${ethers.utils.formatEther(BigNumber.from(value[1]))}`);
  }
}
