resource "aws_db_instance" "insecure_db" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  name                 = "kicsdb"
  username             = "admin"
  password             = "Password123!"   # vulnerability: plaintext password in tf
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
  publicly_accessible  = true              # vulnerability: publicly accessible DB
  storage_encrypted    = false             # vulnerability: unencrypted storage
}
