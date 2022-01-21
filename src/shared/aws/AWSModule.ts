import { Module } from '@nestjs/common';
import { AWSClient } from './AWSClient';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ AWSClient ],
  imports: [ ConfigModule ],
  exports: [ AWSClient ],
})
export class AWSModule {}
