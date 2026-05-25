import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as azureclassic from "@pulumi/azure";

// VULNERABILITY: Resource group with no tags for identification/tracking
const vulnerableResourceGroup = new azure.resources.ResourceGroup("vulnerable-rg", {
    // No tags provided for identification, cost tracking, etc.
});

// VULNERABILITY: Storage account with public access
const vulnerableStorageAccount = new azure.storage.StorageAccount("vulnerablesa", {
    resourceGroupName: vulnerableResourceGroup.name,
    sku: {
        name: "Standard_LRS",
    },
    kind: "StorageV2",
    allowBlobPublicAccess: true, // Public access enabled
    enableHttpsTrafficOnly: false, // HTTP traffic allowed
    minimumTlsVersion: "TLS1_0", // Outdated TLS version
});

// VULNERABILITY: SQL Server with public network access
const vulnerableSqlServer = new azure.sql.Server("vulnerable-sql-server", {
    resourceGroupName: vulnerableResourceGroup.name,
    administratorLogin: "sqladmin",
    administratorLoginPassword: "Password123!", // Hardcoded password
    version: "12.0",
    publicNetworkAccess: "Enabled", // Publicly accessible
});

// VULNERABILITY: SQL Firewall rule allowing all Azure IPs
const vulnerableFirewallRule = new azure.sql.FirewallRule("allow-all-azure", {
    resourceGroupName: vulnerableResourceGroup.name,
    serverName: vulnerableSqlServer.name,
    startIpAddress: "0.0.0.0", // Start of all IPs
    endIpAddress: "255.255.255.255", // End of all IPs
});

// VULNERABILITY: Key Vault with permissive access policy
const vulnerableKeyVault = new azureclassic.keyvault.KeyVault("vulnerable-kv", {
    resourceGroupName: vulnerableResourceGroup.name,
    skuName: "standard",
    tenantId: "00000000-0000-0000-0000-000000000000", // Placeholder tenant ID
    accessPolicies: [{
        tenantId: "00000000-0000-0000-0000-000000000000", // Placeholder tenant ID
        objectId: "00000000-0000-0000-0000-000000000000", // Placeholder object ID
        secretPermissions: ["get", "list", "set", "delete", "purge"], // Over-permissive
        keyPermissions: ["get", "list", "create", "delete", "purge"], // Over-permissive
        certificatePermissions: ["get", "list", "create", "delete", "purge"], // Over-permissive
    }],
    enabledForDiskEncryption: false, // Not enabled for disk encryption
    enabledForDeployment: false, // Not enabled for deployment
    purgeProtectionEnabled: false, // No purge protection
});

// VULNERABILITY: Network security group with open RDP port
const vulnerableNsg = new azure.network.NetworkSecurityGroup("vulnerable-nsg", {
    resourceGroupName: vulnerableResourceGroup.name,
    securityRules: [{
        name: "allow-rdp",
        priority: 100,
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "3389", // RDP port
        sourceAddressPrefix: "*", // From anywhere
        destinationAddressPrefix: "*", // To any VM
    }],
});

// VULNERABILITY: Virtual machine with unmanaged disks
const vulnerableVm = new azure.compute.VirtualMachine("vulnerable-vm", {
    resourceGroupName: vulnerableResourceGroup.name,
    location: vulnerableResourceGroup.location,
    networkProfile: {
        networkInterfaces: [{
            id: "placeholder-nic-id", // Placeholder NIC ID
            primary: true,
        }],
    },
    osProfile: {
        computerName: "vulnerablevm",
        adminUsername: "adminuser",
        adminPassword: "Password123!", // Hardcoded password
    },
    storageProfile: {
        imageReference: {
            publisher: "MicrosoftWindowsServer",
            offer: "WindowsServer",
            sku: "2019-Datacenter",
            version: "latest",
        },
        osDisk: {
            createOption: "FromImage",
            name: "osdisk",
            managedDisk: {
                storageAccountType: "Standard_LRS",
            },
            // No disk encryption set
        },
    },
});

// VULNERABILITY: App Service without HTTPS only
const vulnerableAppService = new azure.web.WebApp("vulnerable-app", {
    resourceGroupName: vulnerableResourceGroup.name,
    httpsOnly: false, // HTTP allowed
    clientCertEnabled: false, // No client certificate required
    clientCertMode: "Optional", // Client cert not required
    siteConfig: {
        ftpsState: "AllAllowed", // FTPS not required
        http20Enabled: false, // HTTP/2 not enabled
        minTlsVersion: "1.0", // Outdated TLS version
        remoteDebuggingEnabled: true, // Remote debugging enabled
    },
});

// Export the vulnerable resources
export const storageAccountName = vulnerableStorageAccount.name;
export const sqlServerName = vulnerableSqlServer.name;
export const keyVaultName = vulnerableKeyVault.name;
export const vmName = vulnerableVm.name;
