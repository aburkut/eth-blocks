
variable "function_name" {}
variable "source_path" {}
variable "handler" {}
variable "schedule_expression" {}
variable "description" {}
variable "region" {}
variable "account_id" {}
variable "etherscan_api_key" {}
variable "etherscan_network" {}
variable "block_start" {}
variable "block_ddb_table" {}
variable "transaction_ddb_table" {}
variable "state_bucket" {}
variable "state_key" {}

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = var.function_name
  description   = var.description
  handler       = var.handler
  runtime       = "nodejs14.x"
  source_path = var.source_path
  timeout = 120
  reserved_concurrent_executions = 1
  attach_cloudwatch_logs_policy = true
  publish = true

  environment_variables = {
    ETHERSCAN_API_KEY      = var.etherscan_api_key
    ETHERSCAN_NETWORK      = var.etherscan_network
    BLOCK_START            = var.block_start
    BLOCKS_DDB_TABLE       = var.block_ddb_table
    TRANSACTIONS_DDB_TABLE = var.transaction_ddb_table
    STATE_BUCKET           = var.state_bucket
    BLOCKS_STATE_FILE      = var.state_key
  }

  allowed_triggers = {
    TriggerRule = {
      principal  = "events.amazonaws.com"
      source_arn = aws_cloudwatch_event_rule.trigger_once_a_minute.arn
    }
  }

  attach_policy_statements = true
  policy_statements = {
    s3_list = {
      effect    = "Allow",
      actions   = ["s3:HeadObject", "s3:ListBucket"],
      resources = ["arn:aws:s3:::${var.state_bucket}"]
    }
    s3_read_write = {
      effect    = "Allow",
      actions   = ["s3:GetObject", "s3:PutObject"],
      resources = ["arn:aws:s3:::${var.state_bucket}/*"]
    },
    block_ddb_table_read_write = {
      effect    = "Allow",
      actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:BatchGetItem", "dynamodb:Query", "dynamodb:BatchWriteItem", "dynamodb:Scan"],
      resources = ["arn:aws:dynamodb:${var.region}:${var.account_id}:table/${var.block_ddb_table}"]
    },
    transaction_ddb_table_read_write = {
      effect    = "Allow",
      actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:BatchGetItem", "dynamodb:Query", "dynamodb:BatchWriteItem", "dynamodb:Scan"],
      resources = ["arn:aws:dynamodb:${var.region}:${var.account_id}:table/${var.transaction_ddb_table}"]
    }
  }

  tags = {
    Name = "ETH puller lambda function"
  }
}

resource "aws_cloudwatch_event_rule" "trigger_once_a_minute" {
  name                = "TriggerLambda"
  description         = "Triggers a lambda function by schedule"
  schedule_expression = var.schedule_expression
}

resource "aws_cloudwatch_event_target" "scan_ami_lambda_function" {
  rule = aws_cloudwatch_event_rule.trigger_once_a_minute.name
  arn  = module.lambda_function.lambda_function_arn
}
