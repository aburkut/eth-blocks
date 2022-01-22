import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { BlockModule } from '../block';
import { CalcService } from './CalcService';

@Module({
  providers: [ CalcService ],
  imports: [ ConfigModule.forRoot(), LoggerModule.forRoot(), BlockModule ],
  exports: [],
})
export class CalcModule {}
