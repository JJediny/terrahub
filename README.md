# TerraHub

TerraHub is a Terraform-centric devops tool that helps provision and manage large amount of cloud resources and cloud services across cloud providers. For example: Serverless on Amazon AWS, Google Cloud or Microsoft Azure.

## Commands

```
  apply ............. run `terraform apply` across multiple terraform scripts
  build ............. build software from predefined build.yml config files
  create ............ create terraform code from predefined templates
  deploy ............ deploy software from predefined deploy.yml config files
  destroy ........... run `terraform destroy` across multiple terraform scripts
  init .............. run `terraform init` across multiple terraform scripts
  list .............. list cloud accounts > regions > applications > services > resources
  plan .............. run `terraform plan` across multiple terraform scripts
  refresh ........... run `terraform refresh` across multiple terraform scripts
  show .............. run `terraform show` across multiple terraform scripts
  workspace .........
  run ...............
  project ...........
```

## @todo

- Hardcode provider
- Fix `--force` parameter
- Generate template into `--name` subdirectory
- Add hook templates to `~/.terrahub/hooks/...` OR keep them internally? KEEP INTERNALLY
- Implement `--include === -i xxx,yyy,zzz` (use module.name) - ADD OPTION PARSER
- Implement `State` class and refactor `Terraform` class
- Add global config file (store all the constants) ???
