import { Test } from '@nestjs/testing';
import * as AWS from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AWSClient } from '../../../../src/shared/aws/AWSClient';

describe('[AWSClient]', () => {
  let awsClient: AWSClient;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ AWSClient ],
      imports: [ ConfigModule, LoggerModule.forRoot() ],
      exports: [ AWSClient ],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
    awsClient = moduleRef.get<AWSClient>(AWSClient);
  });


  describe('[getS3] method', () => {
    it('should return AWS SDK S3 client', () => {
      const actualResult = awsClient.getS3();
      expect(actualResult).toBeInstanceOf(AWS.S3);
    });
  });

  describe('[getDynamoDB] method', () => {
    it('should return AWS SDK DynamoDB client', () => {
      const actualResult = awsClient.getDynamoDB();
      expect(actualResult).toBeInstanceOf(AWS.DynamoDB);
    });
  });

  describe('[getDyno] method', () => {
    it('should return Dyno object', () => {
      jest.spyOn(configService, 'get').mockImplementation(() => 'us-east-1');

      const actualResult = awsClient.getDyno('SOME_TEST_TABLE_NAME');
      expect(actualResult).toMatchSnapshot();
    });
  });

  describe('[getRegion] method', () => {
    it('should return AWS region string', () => {
      jest.spyOn(configService, 'get').mockImplementation(() => 'us-east-1');

      const actualResult = awsClient.getRegion();

      expect(actualResult).toBe('us-east-1');
      expect(configService.get).toHaveBeenCalledTimes(1);
    });
  });
});
