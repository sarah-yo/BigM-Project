# Vulnerable Pulumi Infrastructure

This project contains intentionally vulnerable Pulumi infrastructure code designed for security scanning and testing purposes. The code includes several common security issues that can be detected by security scanning tools.

## Security Vulnerabilities

This codebase intentionally includes the following security vulnerabilities:

1. Exposed secrets in code
2. Insecure storage configurations 
3. Public access to sensitive resources
4. Disabled logging and monitoring
5. Unencrypted data at rest and in transit
6. Over-permissive IAM roles
7. Insecure network configurations
8. Misconfigured security groups

## Usage

This code is for demonstration and testing purposes only. DO NOT deploy this infrastructure in any production environment.

To run the code:

```bash
npm install
pulumi up
```

## Disclaimer

This code contains intentional security vulnerabilities for educational and testing purposes. It should never be used in a production environment.
