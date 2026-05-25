# Security Vulnerabilities in this Codebase

This document lists all the intentional security vulnerabilities in this codebase that can be detected by security scanning tools.

## Authentication & Secrets

1. Hardcoded credentials in code (API keys, passwords)
2. Secrets in plain text configuration files
3. Credentials in user data scripts
4. Credentials in environment variables

## Access Control & IAM

1. Over-permissive IAM policies (wildcard resources, wildcard actions)
2. Public access to sensitive resources (S3, GCS buckets)
3. Admin roles assigned to service accounts
4. Publicly accessible database instances

## Encryption & Data Protection

1. Unencrypted storage (S3, Azure Storage, GCS)
2. Unencrypted databases
3. Unencrypted compute disks
4. Disabled encryption in transit (HTTP instead of HTTPS)
5. KMS keys without rotation

## Network Security

1. Open security groups (0.0.0.0/0)
2. Publicly exposed management ports (SSH, RDP)
3. Insecure protocol configurations (HTTP only, old TLS versions)
4. Missing network policies

## Logging & Monitoring

1. CloudTrail without log validation
2. Missing logging configurations
3. Circular logging

## Resource Configuration

1. Missing backup configurations
2. Insecure default configurations
3. Outdated software versions
4. Missing scan configurations

## Compliance Issues

1. Resources without proper tagging
2. Missing resource ownership information
3. Non-compliant resource configurations

This code was created for educational and testing purposes only. DO NOT deploy this infrastructure in a production environment.
