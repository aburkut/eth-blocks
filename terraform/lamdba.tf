
locals {
  account_id = data.aws_caller_identity.current.account_id
  region = data.aws_region.current.name
}

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "eth-puller"
  description   = "The function which pulls ETH blocks and transaction into DDB tables"
  handler       = "lambda.bootstrap"
  runtime       = "nodejs14.x"
  source_path = "../dist/"
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
      resources = ["arn:aws:s3:::${aws_s3_bucket.eth-blocks-state.bucket}"]
    }
    s3_read_write = {
      effect    = "Allow",
      actions   = ["s3:GetObject", "s3:PutObject"],
      resources = ["arn:aws:s3:::${aws_s3_bucket.eth-blocks-state.bucket}/*"]
    },
    block_ddb_table_read_write = {
      effect    = "Allow",
      actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:BatchGetItem", "dynamodb:Query", "dynamodb:BatchWriteItem", "dynamodb:Scan"],
      resources = ["arn:aws:dynamodb:${local.region}:${local.account_id}:table/${aws_dynamodb_table.blocks_table.name}"]
    },
    transaction_ddb_table_read_write = {
      effect    = "Allow",
      actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:BatchGetItem", "dynamodb:Query", "dynamodb:BatchWriteItem", "dynamodb:Scan"],
      resources = ["arn:aws:dynamodb:${local.region}:${local.account_id}:table/${aws_dynamodb_table.transactions_table.name}"]
    }
  }

  tags = {
    Name = "ETH puller lambda function"
  }
}

resource "aws_cloudwatch_event_rule" "trigger_once_a_minute" {
  name                = "TriggerLambdaOnceAMinute"
  description         = "Triggers a lambda function once a minute"
  schedule_expression = "rate(1 minute)"
}

resource "aws_cloudwatch_event_target" "scan_ami_lambda_function" {
  rule = aws_cloudwatch_event_rule.trigger_once_a_minute.name
  arn  = module.lambda_function.lambda_function_arn
}
