
resource "aws_s3_bucket" "eth-blocks-state" {
  bucket = var.state_bucket
  acl    = "private"

  tags = {
    Name = "Eth Blocks State"
  }
}
