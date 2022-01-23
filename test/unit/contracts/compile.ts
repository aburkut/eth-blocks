import * as  path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as solc from 'solc';

export const compile = async (filename) => {
  const sourcePath = path.join(__dirname, filename);

  const input = {
    sources: {
      [sourcePath]: {
        content: await promisify(fs.readFile)(sourcePath, { encoding: 'utf8' }),
      },
    },
    language: 'Solidity',
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const artifact = output.contracts[sourcePath];

  return artifact;
};
