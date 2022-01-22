import * as Bluebird from 'bluebird';
import { NestFactory } from '@nestjs/core';
import { PullerModule, PullerService } from './puller';
// @ts-ignore
global.Promise = Bluebird;

process.on('unhandledRejection', (up) => { throw up; });
process.on('exit', (code) => {
  console.log(`Exit with code: ${code}`);
});

export async function blocksPuller() {
  const app = await NestFactory.createApplicationContext(PullerModule);
  await app.select(PullerModule).get(PullerService).pullBlocksWithTransactions();
}

blocksPuller();

module.exports = {
  blocksPuller,
};

