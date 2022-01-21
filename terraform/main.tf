provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "blocks_table" {
  hash_key       = "day"
  range_key      = "number"
  name           = "blocks"
  read_capacity  = 20
  write_capacity = 20
  attribute {
    name = "day"
    type = "S"
  }
  attribute {
    name = "number"
    type = "N"
  }
  tags = {
    Name = "Blocks Table"
  }
}

resource "aws_s3_bucket" "eth-blocks-state" {
  bucket = "eth-blocks-state"
  acl    = "private"

  tags = {
    Name        = "Eth Blocks State"
  }
}

resource "aws_dynamodb_table" "transactions_table" {
  hash_key       = "day"
  range_key      = "hash"
  name           = "transactions"
  read_capacity  = 20
  write_capacity = 20
  attribute {
    name = "day"
    type = "S"
  }
  attribute {
    name = "hash"
    type = "S"
  }
  tags = {
    Name = "Transactions table"
  }
}

output "bucket_arn" {
  value = aws_s3_bucket.eth-blocks-state.arn
}

output "transactions_table_name" {
  value = aws_dynamodb_table.transactions_table.name
}

output "transactions_table_arn" {
  value = aws_dynamodb_table.transactions_table.arn
}

output "blocks_table_name" {
  value = aws_dynamodb_table.blocks_table.name
}

output "blocks_table_arn" {
  value = aws_dynamodb_table.blocks_table.arn
}
