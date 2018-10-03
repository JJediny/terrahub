# aws_spot_instance_request

Provides an EC2 Spot Instance Request resource. This allows instances to be requested on the spot market.

By default Terraform creates Spot Instance Requests with a persistent type, which means that for the duration of their lifetime, AWS will launch an instance with the configured details if and when the spot market will accept the requested price.

On destruction, Terraform will make an attempt to terminate the associated Spot Instance if there is one present.

Spot Instances requests with a one-time type will close the spot request when the instance is terminated either by the request being below the current spot price availability or by a user.

NOTE: Because their behavior depends on the live status of the spot market, Spot Instance Requests have a unique lifecycle that makes them behave differently than other Terraform resources. Most importantly: there is no guarantee that a Spot Instance exists to fulfill the request at any given point in time. See the AWS Spot Instance documentation for more information.

## input variables

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
|account_id|The id of AWS account.|string||Yes|
|region|This is the AWS region.|string|us-east-1|Yes|
|instance_name|The name of instance.|string|{{ name }}|No|
|instance_ami|The AMI to use for the instance.|string||Yes|
|instance_instance_type|The type of instance to start. Updates to this field will trigger a stop/start of the EC2 instance.|string||Yes|
|instance_key_name|The key name of the Key Pair to use for the instance; which can be managed using the aws_key_pair resource.|string||Yes|
|instance_iam_instance_profile|The IAM Instance Profile to launch the instance with. Specified as the name of the Instance Profile. Ensure your credentials have the correct permission to assign the instance profile according to the EC2 documentation, notably iam:PassRole.|string||Yes|
|instance_network_interface_id|The ID of the network interface to attach.|string||Yes|
|instance_device_index|The integer index of the network interface attachment. Limited by instance type.|number|0|No|
|instance_delete_on_termination|Whether or not to delete the network interface on instance termination. Defaults to false. Currently, the only valid value is false, as this is only supported when creating new network interfaces when launching an instance.|boolean|false|No|
|instance_ebs_optimized|If true, the launched EC2 instance will be EBS-optimized. Note that if this is not set on an instance type that is optimized by default then this will show as disabled but if the instance type is optimized by default then there is no need to set this and there is no effect to disabling it.|boolean|true|No|
|instance_disable_api_termination|If true, enables EC2 Instance Termination Protection.|boolean|true|No|
|instance_monitoring|If true, the launched EC2 instance will have detailed monitoring enabled.|boolean|false|No|
|instance_ebs_device_name|The name of the device to mount.|string|/dev/sdb|No|
|instance_ebs_volume_type|The type of volume. Can be standard, gp2, or io1. (Default: standard).|string|standard|No|
|instance_ebs_volume_size|The size of the volume in gigabytes.|number|8|No|
|instance_ebs_delete_on_termination|Whether the volume should be destroyed on instance termination (Default: true).|boolean|true|No|
|instance_ebs_encrypted|Enables EBS encryption on the volume (Default: false). Cannot be used with snapshot_id.|boolean|false|No|
|instance_spot_price|The maximum price to request on the spot market.|string|0.03|No|
|instance_wait_for_fulfillment|If set, Terraform will wait for the Spot Request to be fulfilled, and will throw an error if the timeout of 10m is reached.|boolean|false|No|
|instance_spot_type|If set to one-time, after the instance is terminated, the spot request will be closed.|string|persistent|No|
|instance_launch_group|A launch group is a group of spot instances that launch together and terminate together. If left empty instances are launched and terminated individually.|string||Yes|
|instance_block_duration_minutes|The required duration for the Spot instances, in minutes. This value must be a multiple of 60 (60, 120, 180, 240, 300, or 360). The duration period starts as soon as your Spot instance receives its instance ID.|number|60|No|
|custom_tags|Custom tags.|map||No|
|default_tags|Default tags.|map|{"ThubName"= "{{ name }}","ThubCode"= "{{ code }}","ThubEnv"= "default","Description" = "Managed by TerraHub"}|No|

## output parameters

| Name | Description | Type |
|------|-------------|:----:|
|id|The Spot Instance Request ID.|string|
|thub_id|The Spot Instance Request ID (hotfix for issue hashicorp/terraform#[7982]).|string|
|spot_bid_status|The current bid status of the Spot Instance Request.|string|
|spot_request_state The current request state of the Spot Instance Request.|string|
|spot_instance_id|The Instance ID (if any) that is currently fulfilling the Spot Instance request.|string|
|public_dns|The public DNS name assigned to the instance. For EC2-VPC, this is only available if you've enabled DNS hostnames for your VPC|string|
|public_ip|The public IP address assigned to the instance, if applicable.|string|
|private_dns|The private DNS name assigned to the instance. Can only be used inside the Amazon EC2, and only available if you've enabled DNS hostnames for your VPC.|string|
|private_ip|The private IP address assigned to the instance.|string|