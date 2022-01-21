import * as Bluebird from 'bluebird';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { PullerService, PullerModule } from './puller';
// @ts-ignore
global.Promise = Bluebird;

process.on('unhandledRejection', (up) => { throw up; });
process.on('exit', (code) => {
  console.log(`Exit with code: ${code}`);
});

export async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.select(PullerModule).get(PullerService).pullBlocksWithTransactions();
}

