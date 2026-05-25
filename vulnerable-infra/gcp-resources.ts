import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// VULNERABILITY: GCP storage bucket with public access
const vulnerableGcsBucket = new gcp.storage.Bucket("vulnerable-gcs-bucket", {
    location: "US",
    uniformBucketLevelAccess: false, // Legacy ACLs enabled
});

// VULNERABILITY: Making bucket publicly readable
const publicBucketAccess = new gcp.storage.BucketACL("public-bucket-acl", {
    bucket: vulnerableGcsBucket.name,
    predefinedAcl: "publicRead", // Public read access
});

// VULNERABILITY: Cloud SQL instance with public IP
const vulnerableCloudSql = new gcp.sql.DatabaseInstance("vulnerable-cloudsql", {
    databaseVersion: "MYSQL_5_7",
    settings: {
        tier: "db-f1-micro",
        ipConfiguration: {
            ipv4Enabled: true, // Public IP enabled
            authorizedNetworks: [{
                value: "0.0.0.0/0", // Open to all IPs
            }],
            requireSsl: false, // SSL not required
        },
        backupConfiguration: {
            enabled: false, // Backups disabled
        },
        databaseFlags: [{
            name: "local_infile",
            value: "on", // Insecure flag enabled
        }],
    },
});

// VULNERABILITY: GCE instance with public IP and SSH open to all
const vulnerableGceInstance = new gcp.compute.Instance("vulnerable-gce", {
    machineType: "f1-micro",
    zone: "us-central1-a",
    bootDisk: {
        initializeParams: {
            image: "debian-cloud/debian-9",
        },
    },
    networkInterfaces: [{
        network: "default",
        accessConfigs: [{
            // Public IP
        }],
    }],
    metadata: {
        "block-project-ssh-keys": "false", // Project-wide SSH keys allowed
    },
    serviceAccount: {
        scopes: ["https://www.googleapis.com/auth/cloud-platform"], // Over-permissive scope
    },
    // No shielded VM options
});

// VULNERABILITY: Firewall rule allowing all ingress
const vulnerableFirewall = new gcp.compute.Firewall("vulnerable-firewall", {
    network: "default",
    allows: [{
        protocol: "all", // All protocols
        ports: [], // All ports
    }],
    sourceRanges: ["0.0.0.0/0"], // From anywhere
});

// VULNERABILITY: BigQuery dataset with public access
const vulnerableBigQuery = new gcp.bigquery.Dataset("vulnerable-bq-dataset", {
    accesses: [{
        role: "READER",
        specialGroup: "allAuthenticatedUsers", // Available to all authenticated users
    }],
    defaultTableExpirationMs: 0, // Tables never expire
    deleteContentsOnDestroy: true,
});

// VULNERABILITY: Service account with owner role
const vulnerableServiceAccount = new gcp.serviceaccount.Account("vulnerable-sa", {
    accountId: "vulnerable-service-account",
    displayName: "Vulnerable Service Account",
});

// VULNERABILITY: Over-permissive IAM binding
const vulnerableIamBinding = new gcp.projects.IAMBinding("vulnerable-iam-binding", {
    project: "project-id", // Replace with your project ID
    role: "roles/owner", // Owner role (over-permissive)
    members: [
        pulumi.interpolate`serviceAccount:${vulnerableServiceAccount.email}`,
    ],
});

// VULNERABILITY: Kubernetes cluster with no network policy
const vulnerableGkeCluster = new gcp.container.Cluster("vulnerable-gke", {
    initialNodeCount: 1,
    networkPolicy: {
        enabled: false, // Network policy disabled
    },
    masterAuth: {
        clientCertificateConfig: {
            issueClientCertificate: true, // Less secure client certificate config
        },
    },
    privateClusterConfig: {
        enablePrivateNodes: false, // Public nodes
        enablePrivateEndpoint: false, // Public endpoint
    },
    ipAllocationPolicy: {}, // Default IP allocation policy
    resourceLabels: {}, // No labels for identification
    // No node auto-upgrade
    // No node auto-repair
});

// VULNERABILITY: Pub/Sub topic without encryption
const vulnerablePubSubTopic = new gcp.pubsub.Topic("vulnerable-pubsub-topic", {
    // No encryption key specified
});

// Export the vulnerable resources
export const gcsBucketName = vulnerableGcsBucket.name;
export const cloudSqlName = vulnerableCloudSql.name;
export const gceInstanceName = vulnerableGceInstance.name;
export const gkeClusterName = vulnerableGkeCluster.name;
