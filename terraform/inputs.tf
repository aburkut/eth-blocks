
variable "etherscan_network" {
  type    = string
  default = "homestead"
}

variable "etherscan_api_key" {
  type      = string
  sensitive = true
}

variable "block_start" {
  type    = number
  default = 14055860
}

variable "block_ddb_table" {
  type    = string
  default = "blocks"
}

variable "transaction_ddb_table" {
  type    = string
  default = "transactions"
}

variable "state_bucket" {
  type    = string
  default = "eth-blocks-state"
}

variable "state_key" {
  type    = string
  default = "blocks-state.txt"
}

variable "private_key" {
  type      = string
  sensitive = true
}

variable "smart_contract_address" {
  type = string
}

variable "smart_contact_network" {
  type    = string
  default = "ropsten"
}
