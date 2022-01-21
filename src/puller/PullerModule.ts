import { Module } from '@nestjs/common';
import { PullerService } from './PullerService';
import { ConfigModule } from '@nestjs/config';
import { BlockModule } from '../block';
import { TransactionModule } from '../transaction';
import { LoggerModule } from 'nestjs-pino';
import { StateModule } from '../state';

@Module({
  providers: [ PullerService ],
  imports: [ ConfigModule.forRoot(), LoggerModule.forRoot(), BlockModule, TransactionModule, StateModule ],
  exports: [],
})
export class PullerModule {}
