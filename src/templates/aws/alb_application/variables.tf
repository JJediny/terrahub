# Define list of variables to be used in main.tf

############
# provider #
############
variable "account_id" {
  description = "Allowed AWS account ID, to prevent you from mistakenly using an incorrect one (and potentially end up destroying a live environment)."
}

variable "region" {
  description = "This is the AWS region."
}

#############
# top level #
#############
variable "lb_name" {
  description = "The name of the LB. This name must be unique within your AWS account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen. If not specified, Terraform will autogenerate a name beginning with tf-lb."
}

variable "lb_internal" {
  description = "If true, the LB will be internal."
}

variable "lb_load_balancer_type" {
  description = "The type of load balancer to create. Possible values are application or network. The default value is application."
}

variable "lb_security_groups" {
  type = "list"
  description = "A list of security group IDs to assign to the LB. Only valid for Load Balancers of type application."
}

variable "lb_subnets" {
  type = "list"
  description = "A list of subnet IDs to attach to the LB. Subnets cannot be updated for Load Balancers of type network. Changing this value for load balancers of type network will force a recreation of the resource."
}

################
# log atribute #
################
variable "lb_log_bucket" {
  description = "The S3 bucket name to store the logs in."
}

variable "lb_log_prefix" {
  description = "The S3 bucket prefix. Logs are stored in the root if not configured."
}

variable "lb_log_enabled" {
  description = "Boolean to enable / disable access_logs"
}

#####################
# optional atribute #
#####################
variable "lb_idle_timeout" {
  description = "The time in seconds that the connection is allowed to be idle. Only valid for Load Balancers of type application."
}

variable "lb_enable_deletion_protection" {
  description = "If true, deletion of the load balancer will be disabled via the AWS API. This will prevent Terraform from deleting the load balancer."
}

variable "lb_enable_cross_zone_load_balancing" {
  description = "If true, cross-zone load balancing of the load balancer will be enabled. This is a network load balancer feature."
}

variable "lb_enable_http2" {
  description = "Indicates whether HTTP/2 is enabled in application load balancers."
}

########
# tags #
########
variable "custom_tags" {
  type        = "map"
  description = "Custom tags"
  default     = {}
}

variable "default_tags" {
  type        = "map"
  description = "Default tags"
  default     = {}
}