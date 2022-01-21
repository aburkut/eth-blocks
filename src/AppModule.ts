import { Module } from '@nestjs/common';
import { PullerModule } from './puller';
import { TransactionModule } from './transaction';
import { BlockModule } from './block';
import { StateModule } from './state';

@Module({
  imports: [
    PullerModule,
    TransactionModule,
    BlockModule,
    StateModule,
  ],
})
export class AppModule {}
