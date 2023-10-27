packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-west-1"
}

variable "source_ami" {
  type    = string
  default = "ami-071175b60c818694f" # Debian 12 us-west-1

  validation {
    condition     = length(var.source_ami) > 4 && substr(var.source_ami, 0, 4) == "ami-"
    error_message = "The source_ami value must be a valid AMI ID, starting with \"ami-\"."
  }
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-054a885756c2f1089"
}


variable "demo_user" {
  type    = string
  default = "656825459572"
}

# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions = [
    "${var.aws_region}",
  ]
  ami_users = [
    "${var.demo_user}",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sdf"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get upgrade -y",
      "sudo apt-get install nodejs npm -y",
      "sudo apt-get install zip -y",
      "cd /home/admin",
      "unzip webapp.zip",
      "sudo apt-get clean",
    ]
  }
}