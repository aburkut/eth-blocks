
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
