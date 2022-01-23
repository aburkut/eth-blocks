
locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = data.aws_region.current.name
}

module "puller_lambda" {
  source = "./lambda"

  region     = local.region
  account_id = local.account_id

  function_name       = "eth-puller"
  description         = "The function which pulls ETH blocks and transaction into DDB tables"
  handler             = "lambdas.blocksPuller"
  source_path         = "../dist"
  schedule_expression = "rate(1 minute)"

  etherscan_api_key      = var.etherscan_api_key
  etherscan_network      = var.etherscan_network
  block_start            = var.block_start
  block_ddb_table        = var.block_ddb_table
  transaction_ddb_table  = var.transaction_ddb_table
  state_bucket           = var.state_bucket
  state_key              = var.state_key
  private_key            = var.private_key
  smart_contract_address = var.smart_contract_address
  smart_contact_network  = var.smart_contact_network
}

module "calc_lambda" {
  source = "./lambda"

  region     = local.region
  account_id = local.account_id

  depends_on = [module.puller_lambda]

  function_name       = "eth-blocks-calc"
  description         = "The function which calcs blocks number and gas fee"
  handler             = "lambdas.blocksCalc"
  source_path         = "../dist"
  schedule_expression = "cron(10 00 * * ? *)"

  etherscan_api_key      = var.etherscan_api_key
  etherscan_network      = var.etherscan_network
  block_start            = var.block_start
  block_ddb_table        = var.block_ddb_table
  transaction_ddb_table  = var.transaction_ddb_table
  state_bucket           = var.state_bucket
  state_key              = var.state_key
  private_key            = var.private_key
  smart_contract_address = var.smart_contract_address
  smart_contact_network  = var.smart_contact_network
}

