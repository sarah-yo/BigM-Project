provider "aws" {
  region = var.region
}

# 1) Public S3 bucket (ACL public-read + bucket policy omitted for brevity)
resource "aws_s3_bucket" "public_bucket" {
  bucket = "kics-test-vulnerable-bucket"
  acl    = "public-read"     # vulnerability: public-read ACL
  force_destroy = true
}

# 2) Security group that allows SSH/RDP from anywhere
resource "aws_security_group" "open_sg" {
  name        = "open-sg"
  description = "Open SG for testing"

  ingress {
    description = "ssh from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # vulnerability: 0.0.0.0/0
  }

  ingress {
    description = "rdp from anywhere"
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # vulnerability: 0.0.0.0/0
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
