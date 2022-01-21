import { Injectable } from '@nestjs/common';
import { BlockService } from '../block';
import { BigNumber, ethers } from 'ethers';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CalcService {
  constructor(
    private readonly blockService: BlockService,
    private readonly logger: PinoLogger,
  ) {}

  public async calcBlocksAndFees() {
    const day = '2022-01-21';
    this.logger.info(`Start calculating total number of blocks and ETH spent on gas fees for ${day}`);

    const blocks = await this.blockService.fetchBlockByDay(day);
    const count = blocks.length;

    const totalGasUsed = blocks.reduce((memo, block) => {
      return memo.add(BigNumber.from(block.gasUsed));
    },  ethers.constants.Zero);

    this.logger.info(`Total number of blocks: ${count}`);
    this.logger.info(`ETH spent on gas fees: ${ethers.utils.formatEther(totalGasUsed)}`);

    // The Contract interface
    let abi = [
      'event ValueChanged(address indexed author, string oldValue, string newValue)',
      'constructor(string value)',
      'function getValue() view returns (string value)',
      'function setValue(string value)',
    ];

    let provider = ethers.getDefaultProvider();
    let contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8';

    let contract = new ethers.Contract(contractAddress, abi, provider);

    let currentValue = await contract.getValue();

    console.log(currentValue);
  }
}
