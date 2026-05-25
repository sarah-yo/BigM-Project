# Microsoft Defender CLI Setup

The `defender-cli-scan.yml` workflow automatically downloads and runs the Microsoft Defender CLI based on the runner's operating system and architecture.

## Supported Platforms

The workflow automatically detects and downloads the appropriate CLI version:

### Windows
- `Defender_win-x64.exe` (Intel/AMD 64-bit)
- `Defender_win-x86.exe` (Intel/AMD 32-bit)  
- `Defender_win-arm64.exe` (ARM 64-bit)

### Linux
- `Defender_linux-x64` (Intel/AMD 64-bit)
- `Defender_linux-arm64` (ARM 64-bit)

### macOS
- `Defender_osx-x64` (Intel 64-bit)
- `Defender_osx-arm64` (Apple Silicon)

## Authentication Setup

To use the Defender CLI effectively, you'll need to configure authentication credentials as GitHub secrets:

### Required Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → Secrets tab

Add these repository secrets (exact names depend on Defender CLI requirements):

1. **DEFENDER_TENANT_ID**
   - Your Azure Active Directory tenant ID
   
2. **DEFENDER_CLIENT_ID** 
   - Service principal client ID with appropriate permissions
   
3. **DEFENDER_CLIENT_SECRET**
   - Service principal client secret
   
4. **DEFENDER_SUBSCRIPTION_ID** (if needed)
   - Azure subscription ID

### Workflow Configuration

Once secrets are configured, update the scan step in `defender-cli-scan.yml`:

```yaml
- name: Run Defender CLI Scan
  env:
    DEFENDER_TENANT_ID: ${{ secrets.DEFENDER_TENANT_ID }}
    DEFENDER_CLIENT_ID: ${{ secrets.DEFENDER_CLIENT_ID }}
    DEFENDER_CLIENT_SECRET: ${{ secrets.DEFENDER_CLIENT_SECRET }}
  run: |
    # Authenticate with Defender CLI
    $CLI_EXECUTABLE auth login --tenant-id $DEFENDER_TENANT_ID --client-id $DEFENDER_CLIENT_ID --client-secret $DEFENDER_CLIENT_SECRET
    
    # Run container scan
    $CLI_EXECUTABLE scan container --target ${{ vars.REGISTRY_HOST }}/${{ vars.ARTIFACT_NAME }}:test
```

## Current State

The workflow currently:
✅ **Auto-detects OS and architecture**  
✅ **Downloads appropriate CLI version**  
✅ **Verifies CLI accessibility**  
⚠️ **Needs authentication configuration**  
⚠️ **Needs scan command customization**  

## Next Steps

1. **Add repository secrets** for authentication
2. **Update the scan command** with proper parameters
3. **Configure result upload** and artifact handling
4. **Test the workflow** with your specific requirements

## Notes

- The CLI download URLs point to the latest version
- The workflow includes OS/architecture detection for cross-platform support
- Authentication requirements may vary based on your Defender for Cloud configuration
- Consult Microsoft Defender CLI documentation for specific scan parameters
