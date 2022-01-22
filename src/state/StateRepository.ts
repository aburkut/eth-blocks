import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { AWSClient } from '../shared/aws';

@Injectable()
export class StateRepository {
  constructor(
    private readonly awsClient: AWSClient,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {}

  public async getState(): Promise<number> {
    const Bucket = this.configService.get<string>('STATE_BUCKET');
    const Key = this.configService.get<string>('BLOCKS_STATE_FILE');

    const { Body } = await this.awsClient.getS3().getObject({ Bucket, Key }).promise();

    this.logger.info(`Getting state ${Body.toString()} from s3://${Bucket}/${Key}...`);

    return parseInt(Body.toString());
  }

  public async updateState(blockNumber: number): Promise<number> {
    const Bucket = this.configService.get<string>('STATE_BUCKET');
    const Key = this.configService.get<string>('BLOCKS_STATE_FILE');

    await this.awsClient.getS3().putObject({ Bucket, Key, Body: blockNumber.toString() }).promise();

    this.logger.info(`Updated state to ${blockNumber} in s3://${Bucket}/${Key}...`);

    return blockNumber;
  }
}
