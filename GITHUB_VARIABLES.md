# GitHub Repository Variables Setup

To use the Microsoft Security DevOps Action and registry-based image tagging, you need to set up the following variables in your GitHub repository.

## Required Variables

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → Variables tab

Add these repository variables:

### 1. **REGISTRY_HOST**
- **Name**: `REGISTRY_HOST`
- **Value**: The registry hostname (e.g., `ghcr.io`, `localhost`, `myregistry.azurecr.io`)
- **Example**: `ghcr.io`

### 2. **ARTIFACT_NAME**
- **Name**: `ARTIFACT_NAME`
- **Value**: The name of your container image
- **Example**: `vulnerable-app`

## Example Configuration

If using GitHub Container Registry:
```
REGISTRY_HOST = ghcr.io
ARTIFACT_NAME = vulnerable-app
```

If using local/test registry:
```
REGISTRY_HOST = localhost
ARTIFACT_NAME = vulnerable-app
```

If using Azure Container Registry:
```
REGISTRY_HOST = myregistry.azurecr.io
ARTIFACT_NAME = vulnerable-app
```

## Resulting Image Tags

With these variables, your images will be tagged as:
- Build: `{REGISTRY_HOST}/{ARTIFACT_NAME}:test`
- Trivy Target: `{REGISTRY_HOST}/{ARTIFACT_NAME}:test`

## Setup Instructions

1. Go to https://github.com/jbrotsos/vuln-container/settings/variables/actions
2. Click "New repository variable" for each variable above
3. Enter the name and value
4. Click "Add variable"
5. Re-run your GitHub Actions workflow

## Note

The workflow will fail until these variables are set up, as they are required for the Microsoft Security DevOps Action and image tagging.
