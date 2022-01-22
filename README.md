## Setup:

- `git clone git@github.com:aburkut/eth-blocks.git cd eth-blocks`
- `nvm use 14.17`
- `npm install`

### NPM scripts:
- `npm run build` - compile TS files and install deps for dist folder
- `npm run start:dev:puller` - runs puller service (for local development)
- `npm run start:dev:calc` - runs calc service (for local development)
- `npm run deploy:contract` - deploy smart contract to specific network
- `npm test` - runs tests
- `npm run lint` - runs eslint checks
- `npm run lint:fix` - runs eslint checks and fixes problems

## Environment variables:
- `ETHERSCAN_API_KEY=xx`
- `ETHERSCAN_NETWORK=xxx`
- `BLOCK_START=xxx`
- `BLOCKS_DDB_TABLE=blocks`
- `TRANSACTIONS_DDB_TABLE=transactions`
- `AWS_ACCESS_KEY_ID=xxx`
- `AWS_SECRET_ACCESS_KEY=xxx`
- `AWS_REGION=us-east-1`
- `STATE_BUCKET=eth-blocks-state`
- `BLOCKS_STATE_FILE=blocks-state.txt`
- `SMART_CONTRACT_NETWORK=ropsten`
- `SMART_CONTRACT_ADDRESS=xxx`
- `PRIVATE_KEY=xxx`


## Architecture:
- Two AWS scheduled AWS Lambda functions - puller and calc.
- Database - AWS Dynamodb 
