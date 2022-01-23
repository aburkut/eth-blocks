import Ganache from 'ganache';
import * as Web3 from 'web3';
import { compile } from './compile';

describe('[SimpleStorage] smart contact', () => {
  let contractInstance;
  let accounts;
  let provider;
  let web3;
  let gas;

  beforeAll(async () => {
    try {
      const { SimpleStorage } = await compile('../../../contracts/SimpleStorage.sol');

      provider = Ganache.provider();
      web3 = new (Web3 as any)(provider);
      accounts = await web3.eth.getAccounts();

      const instance = new web3.eth.Contract(SimpleStorage.abi);

      gas = await instance
        .deploy({ data: SimpleStorage.evm.bytecode.object })
        .estimateGas();

      const deployedInstance = await instance
        .deploy({ data: SimpleStorage.evm.bytecode.object })
        .send({ from: accounts[0], gas: gas + 100000 });

      contractInstance = deployedInstance;

    } catch(err) {
      throw err
    }
  });

  afterAll(() => {
    provider.disconnect();
  });

  describe('[getDays] method', () => {
    it('should return empty array by default', async () => {
      const days = await contractInstance.methods.getDays().call();
      expect(days).toStrictEqual([]);
    });

    it('should return correct days data', async () => {
      await contractInstance.methods.setDay('2021-01-22', 455, '0x05de9537').send({ from: accounts[0], gas: gas + 100000  });
      await contractInstance.methods.setDay('2021-01-23', 500, '0x05de9537').send({ from: accounts[0], gas: gas + 100000  });
      await contractInstance.methods.setDay('2021-01-24', 1200, '0x05de9537').send({ from: accounts[0], gas: gas + 100000  });
      await contractInstance.methods.setDay('2021-01-25', 657, '0x05de9537').send({ from: accounts[0], gas: gas + 100000  });
      const days = await contractInstance.methods.getDays().call();

      expect(days).toStrictEqual(['2021-01-22', '2021-01-23', '2021-01-24', '2021-01-25']);
    });
  });

  describe('[setDay] method', () => {
    it('should create new day in mapping', async () => {
      await contractInstance.methods.setDay('2022-01-22', 333, '0x05de9537').send({ from: accounts[0], gas: gas + 100000  });
      await contractInstance.methods.setDay('2022-01-23', 654, '0x05de9537').send({ from: accounts[0], gas: gas + 100000  });

      const result1 = await contractInstance.methods.dayMapping('2022-01-22').call();
      const result2 = await contractInstance.methods.dayMapping('2022-01-23').call();

      expect(result1).toEqual({
        0: '333',
        1: '0x05de9537',
        blocksNumber: '333',
        ethSpent: '0x05de9537',
      });
      expect(result2).toEqual({
        0: '654',
        1: '0x05de9537',
        blocksNumber: '654',
        ethSpent: '0x05de9537',
      });
    });

    it('should not allow non-creator to write to the smart contract', async () => {
      try {
        await contractInstance.methods.setDay('2022-01-22', 333, '0x05de9537').send({ from: accounts[1], gas: gas + 100000  });
      } catch (err) {
        expect(err.name).toBe('Error');
      }
    });
  });
});


