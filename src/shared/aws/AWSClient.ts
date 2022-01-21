import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as https from 'https';
import * as Dyno from '@mapbox/dyno';

@Injectable()
export class AWSClient {

  private readonly DynamoDB: AWS.DynamoDB;

  private readonly S3: AWS.S3;

  private readonly agent: https.Agent;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.agent = new https.Agent({
      keepAlive: true,
      maxSockets: Infinity,
    });

    this.DynamoDB = new AWS.DynamoDB({
      ...this.getDynamoDBConfig(),
      httpOptions: this.configService.get('DYNAMO_DB_HTTP_OPTIONS') !== undefined ?
        this.configService.get('DYNAMO_DB_HTTP_OPTIONS') as AWS.HTTPOptions
        : { agent: this.agent },
    });

    this.S3 = new AWS.S3({
      ...this.getS3Config(),
      httpOptions: this.configService.get('S3_HTTP_OPTIONS') !== undefined ?
        this.configService.get('S3_HTTP_OPTIONS') as AWS.HTTPOptions
        : { agent: this.agent },
    });
  }

  public getDynamoDBConfig(): { region: string, endpoint: string } {
    return {
      region: this.getRegion(),
      endpoint: this.configService.get('DYNAMO_DB_ENDPOINT'),
    };
  }

  public getRegion(): string {
    return this.configService.get('AWS_REGION') || this.configService.get('AWS_DEFAULT_REGION');
  }

  public getDyno(tableName: string): Dyno {
    return Dyno({
      table: tableName,
      ...this.getDynamoDBConfig(),
      httpOptions: this.configService.get('DYNAMO_DB_HTTP_OPTIONS') !== undefined ?
        this.configService.get('DYNAMO_DB_HTTP_OPTIONS') as AWS.HTTPOptions
        : { agent: this.agent },
    });
  }

  public getS3Config(): { region: string, maxRetries: number, s3ForcePathStyle: boolean, endpoint: string, concurrency: number } {
    return {
      region: this.getRegion(),
      maxRetries: 20,
      s3ForcePathStyle: Boolean(this.configService.get('S3_FORCE_PATH_STYLE')),
      endpoint: this.configService.get('S3_END_POINT'),
      concurrency: parseInt(this.configService.get('S3_CONCURRENCY')),
    };
  }

  public getS3(): AWS.S3 {
    return this.S3;
  }

  public getDynamoDB(): AWS.DynamoDB {
    return this.DynamoDB;
  }
}
