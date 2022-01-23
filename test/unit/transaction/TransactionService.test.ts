import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AWSModule } from '../../../src/shared/aws';
import { TransactionRepository, TransactionService } from '../../../src/transaction';
import * as AWS from 'aws-sdk';

describe('[TransactionService]', () => {
  let transactionService: TransactionService;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ TransactionService, TransactionRepository ],
      imports: [ LoggerModule.forRoot(), AWSModule, ConfigModule ],
      exports: [ TransactionService ],
    }).compile();

    transactionService = moduleRef.get<TransactionService>(TransactionService);
    transactionRepository = moduleRef.get<TransactionRepository>(TransactionRepository);
  });

  describe('[saveTransaction] method', () => {
    it('should save transaction', async () => {
      const fakeResult = { result: true };
      jest
        .spyOn(transactionRepository, 'saveTransaction')
        .mockImplementation(() => Promise.resolve(fakeResult as AWS.DynamoDB.PutItemOutput));

      const result = await transactionService.saveTransaction('2022-01-22', { hash: '0x12312d123123' });

      expect(result).toStrictEqual(fakeResult);
      expect(transactionRepository.saveTransaction).toHaveBeenCalledTimes(1);
      expect(transactionRepository.saveTransaction).toHaveBeenCalledWith('2022-01-22', { hash: '0x12312d123123' });
    });
  });

  describe('[saveTransactionsList]', () => {
    it('should call saveTransaction per each transaction passed', async () => {
      jest
        .spyOn(transactionService, 'saveTransaction')
        .mockImplementation(() => Promise.resolve({ result : true } as AWS.DynamoDB.PutItemOutput));

      const result = await transactionService.saveTransactionsList('2022-01-22', [ { hash: '0x12312d123123' }, { hash: '0x131233' } ]);

      expect(result).toStrictEqual([ { result : true }, { result : true } ]);
      expect(transactionService.saveTransaction).toHaveBeenCalledTimes(2);
    });
  });
});
