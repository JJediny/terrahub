# aws_dynamodb_table

Create a DynamoDB table resource.

## input variables

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
|account_id|The id of AWS account.|string||Yes|
|region|This is the AWS region.|string|us-east-1|Yes|
|dynamodb_table_name|The name of the table, this needs to be unique within a region.|string||Yes|
|dynamodb_read_capacity|The number of read units for this table.|int||Yes|
|dynamodb_write_capacity|The number of write units for this table.|int||Yes|
|dynamodb_hash_key|The attribute to use as the hash key (the attribute must also be defined as an attribute record.|string||Yes|
|dynamodb_stream_enabled|Indicates whether Streams are to be enabled (true) or disabled (false).|bool|false|No|
|dynamodb_atribute_name|The name of the attribute.|string||Yes|
|dynamodb_atribute_type|One of: S, N, or B for (S)tring, (N)umber or (B)inary data.|string||Yes|
|custom_tags|Custom tags.|map||No|
|default_tags|Default tags.|map|{"ThubName"= "{{ name }}","ThubCode"= "{{ code }}","ThubEnv"= "default","Description" = "Managed by TerraHub"}|No|


## output parameters

| Name | Description | Type |
|------|-------------|:----:|
|dynamodb_table_arn|The arn of the table|string|
|dynamodb_table_id|The name of the table|string|
|dynamodb_table_stream_arn|The ARN of the Table Stream. Only available when stream_enabled = true|string|
|dynamodb_table_stream_label|A timestamp, in ISO 8601 format, for this stream. Note that this timestamp is not a unique identifier for the stream on its own. However, the combination of AWS customer ID, table name and this field is guaranteed to be unique. It can be used for creating CloudWatch Alarms. Only available when stream_enabled = true|string|