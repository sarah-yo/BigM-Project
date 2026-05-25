# Security Policy

## Purpose

This repository contains a **deliberately vulnerable application** created specifically for testing container security scanning tools like Trivy. 

## ⚠️ Important Security Notice

**THIS APPLICATION CONTAINS INTENTIONAL SECURITY VULNERABILITIES**

- **Do NOT deploy in production environments**
- **Do NOT expose to the internet**
- **Use only in isolated test environments**
- **Do NOT use as a base for real applications**

## Vulnerabilities by Design

This application intentionally includes:

### Dependencies
- Outdated Node.js packages with known CVEs
- Vulnerable versions of Express, Lodash, Moment, Axios, JWT, and Mongoose

### Base Image
- Outdated Node.js Docker base image with OS-level vulnerabilities

### Application Code
- Template injection vulnerabilities
- Weak authentication mechanisms
- Server-Side Request Forgery (SSRF)
- Missing input validation

## Reporting Issues

Since this is a test application with intentional vulnerabilities:

- **Security vulnerabilities are expected and intentional**
- Report only if you find issues with the testing infrastructure or documentation
- Open an issue for build problems or workflow failures

## Testing Environment Recommendations

When using this application for security testing:

1. **Network Isolation**: Run in isolated networks only
2. **Container Isolation**: Use appropriate container isolation
3. **Access Control**: Restrict access to test environments only
4. **Monitoring**: Monitor for any unintended network activity
5. **Cleanup**: Remove containers and images after testing

## Supported Versions

| Version | Supported          | Purpose |
| ------- | ------------------ | ------- |
| Latest  | ✅ Testing Only    | Security scanner testing |
| All     | ❌ NOT for Production | Educational/Testing only |

## License

This project is licensed under MIT License - see LICENSE file for details.

The MIT license applies to the code structure and documentation, but remember that this code should never be used in production environments due to intentional security vulnerabilities.
