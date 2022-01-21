import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockService } from './BlockService';
import { BlockRepository } from './BlockRepository';
import { AWSModule } from '../shared/aws';
import { LoggerModule } from 'nestjs-pino';

@Module({
  providers: [ BlockService, BlockRepository ],
  imports: [ LoggerModule, AWSModule, ConfigModule ],
  exports: [ BlockService ],
})
export class BlockModule {}
