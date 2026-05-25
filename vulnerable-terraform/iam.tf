# Overly broad IAM policy (wildcard actions + resources)
resource "aws_iam_policy" "admin_policy" {
  name        = "kics_overly_permissive_policy"
  description = "Policy with * actions and * resources for testing scanners"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["*"]       # vulnerability: wildcard action
        Resource = ["*"]     # vulnerability: wildcard resource
      }
    ]
  })
}

resource "aws_iam_user" "test_user" {
  name = "kics-test-user"
}

resource "aws_iam_user_policy_attachment" "attach" {
  user       = aws_iam_user.test_user.name
  policy_arn = aws_iam_policy.admin_policy.arn
}
