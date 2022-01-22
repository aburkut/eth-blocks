import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { AWSModule } from '../../src/shared/aws';
import { BlockRepository, BlockService } from '../../src/block';

describe('[BlockService]', () => {
  let blockService: BlockService;
  let blockRepository: BlockRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ BlockService, BlockRepository ],
      imports: [ LoggerModule.forRoot(), AWSModule, ConfigModule ],
      exports: [ BlockService ],
    }).compile();

    blockService = moduleRef.get<BlockService>(BlockService);
    blockRepository = moduleRef.get<BlockRepository>(BlockRepository);
  });

  describe('[saveBlock] method', () => {
    it('should save block with omitted transactions and day', async () => {
      const day = '2019-12-12';

      jest.spyOn(blockRepository, 'saveBlock').mockImplementation(() => {
        return Promise.resolve({ result: true } as AWS.DynamoDB.PutItemOutput);
      });

      jest.spyOn(blockService, 'getDay').mockImplementation(() => day);

      const fakeBlock = {
        number: 213123123,
        transactions: ['transaction1', 'transaction2', 'transaction3'],
      };

      const result = await blockService.saveBlock(fakeBlock);

      expect(blockRepository.saveBlock).toHaveBeenCalledWith({ number: 213123123, day });
      expect(result).toStrictEqual({ result: true });
    });
  });

  describe('[getDay] method', () => {
    it('should return correct date string from timestamp', () => {
      expect(blockService.getDay(1548174880)).toBe('2019-01-22');
      expect(blockService.getDay(929810080)).toBe('1999-06-19');
      expect(blockService.getDay(495041680)).toBe('1985-09-08');
      expect(blockService.getDay(1641054880)).toBe('2022-01-01');
    });
  });

  describe('[fetchBlockByDay] method', () => {
    it('should call block service method', async () => {
      const day = '2022-01-22';
      const fakeResults = [
        {
          number: 123121
        },
        {
          number: 23123131312
        },
      ] as AWS.DynamoDB.ItemList;

      jest.spyOn(blockRepository, 'fetchBlocksByDay').mockImplementation(() => Promise.resolve(fakeResults));

      const result = await blockService.fetchBlocksByDay(day);

      expect(blockRepository.fetchBlocksByDay).toHaveBeenCalledTimes(1);
      expect(blockRepository.fetchBlocksByDay).toHaveBeenCalledWith(day)
      expect(result).toStrictEqual(fakeResults);
    });
  });
});
