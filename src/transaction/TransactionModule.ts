import { Module } from '@nestjs/common';
import { TransactionService } from './TransactionService';
import { TransactionRepository } from './TransactionRepository';
import { AWSModule } from '../shared/aws';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
    providers: [ TransactionService, TransactionRepository ],
    imports: [ LoggerModule.forRoot(), AWSModule, ConfigModule ],
    exports: [ TransactionService ],
})
export class TransactionModule {}
