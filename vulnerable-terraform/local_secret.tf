resource "local_file" "creds" {
  content  = "API_TOKEN=secret-token-abc-123"  # vulnerability: plaintext secret in code
  filename = "${path.module}/leaked_creds.txt"
}
