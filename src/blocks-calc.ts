import * as Bluebird from 'bluebird';
import { NestFactory } from '@nestjs/core';
import { CalcModule, CalcService } from './calc';
// @ts-ignore
global.Promise = Bluebird;

process.on('unhandledRejection', (up) => { throw up; });
process.on('exit', (code) => {
  console.log(`Exit with code: ${code}`);
});

export async function blocksCalc() {
  const app = await NestFactory.createApplicationContext(CalcModule);
  await app.select(CalcModule).get(CalcService).process();
}

module.exports = {
  blocksCalc,
};
