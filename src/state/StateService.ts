import { Injectable } from '@nestjs/common';
import { StateRepository } from './StateRepository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StateService {
  constructor(
    private readonly stateRepository: StateRepository,
    private readonly configService: ConfigService,
  ) {}

  public async getState(): Promise<number> {
    let state;

    try {
      state = await this.stateRepository.getState();
    } catch (err) {
      if(err.code === 'NoSuchKey') {
        return this.updateState(parseInt(this.configService.get<string>('BLOCK_START')));
      }
    }

    return state;
  }

  public async updateState(blockNumber: number): Promise<number> {
    return this.stateRepository.updateState(blockNumber);
  }
}
