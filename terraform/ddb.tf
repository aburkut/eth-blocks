
resource "aws_dynamodb_table" "blocks_table" {
  hash_key       = "day"
  range_key      = "number"
  name           = var.block_ddb_table
  read_capacity  = 50
  write_capacity = 50
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

resource "aws_dynamodb_table" "transactions_table" {
  hash_key       = "day"
  range_key      = "hash"
  name           = var.transaction_ddb_table
  read_capacity  = 50
  write_capacity = 50
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
