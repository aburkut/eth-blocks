import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AWSModule } from '../shared/aws';
import { StateService } from './StateService';
import { StateRepository } from './StateRepository';

@Module({
  providers: [ StateService, StateRepository ],
  imports: [ LoggerModule, AWSModule, ConfigModule ],
  exports: [ StateService ],
})
export class StateModule {}
