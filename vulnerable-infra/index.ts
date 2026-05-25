import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as azure from "@pulumi/azure-native";
import * as gcp from "@pulumi/gcp";

// Import resources from other files
import "./aws-resources";
import "./azure-resources";
import "./gcp-resources";

// VULNERABILITY: Hardcoded credentials in code
const databasePassword = "SuperSecret123!";
const apiKey = "sk_live_1234567890abcdefghijklmnopqrstuvwxyz";

// VULNERABILITY: Unencrypted S3 bucket with public access
const vulnerableS3Bucket = new aws.s3.Bucket("vulnerable-data-bucket", {
    acl: "public-read", // Public readable
    forceDestroy: true,
});

// VULNERABILITY: S3 bucket without versioning
const noVersioningBucket = new aws.s3.Bucket("no-versioning-bucket", {
    versioning: {
        enabled: false, 
    },
});

// VULNERABILITY: S3 bucket logging to itself (circular logging)
const circularLoggingBucket = new aws.s3.Bucket("circular-logging-bucket", {
    loggings: [{
        targetBucket: "circular-logging-bucket", // Logs to itself
        targetPrefix: "logs/",
    }],
});

// VULNERABILITY: Over-permissive IAM policy
const adminPolicy = new aws.iam.Policy("admin-policy", {
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "*", // Allow all actions
            Effect: "Allow",
            Resource: "*", // On all resources
        }],
    }),
});

// VULNERABILITY: Publicly accessible RDS instance
const vulnerableRdsInstance = new aws.rds.Instance("vulnerable-db", {
    engine: "mysql",
    instanceClass: "db.t3.micro",
    allocatedStorage: 20,
    name: "mydb",
    username: "admin",
    password: databasePassword, // Using hardcoded password
    skipFinalSnapshot: true,
    publiclyAccessible: true, // Publicly accessible
    vpcSecurityGroupIds: [],
});

// VULNERABILITY: Insecure security group allowing all traffic
const openSecurityGroup = new aws.ec2.SecurityGroup("open-security-group", {
    description: "Allow all traffic",
    ingress: [{
        protocol: "-1", // All protocols
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"], // From anywhere
    }],
    egress: [{
        protocol: "-1", // All protocols
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"], // To anywhere
    }],
});

// VULNERABILITY: EC2 instance with vulnerable configuration
const vulnerableEc2Instance = new aws.ec2.Instance("vulnerable-instance", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t2.micro",
    vpcSecurityGroupIds: [openSecurityGroup.id], // Using the open security group
    userData: `#!/bin/bash
        export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
        export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    `, // Hardcoded credentials in user data
});

// VULNERABILITY: Unencrypted disk in Azure
const vulnerableAzureDisk = new azure.compute.Disk("vulnerable-disk", {
    resourceGroupName: "example-resources",
    diskSizeGB: 30,
    createOption: "Empty",
    encryption: {
        diskEncryptionSetId: "", // No encryption set
        type: "EncryptionAtRestWithPlatformKey", // Using platform key instead of customer-managed key
    },
});

// VULNERABILITY: GCP bucket with public access
const vulnerableGcpBucket = new gcp.storage.Bucket("vulnerable-gcp-bucket", {
    location: "US",
    uniformBucketLevelAccess: false, // Not using uniform bucket-level access
});

// VULNERABILITY: Make GCP bucket publicly readable
const bucketIamBinding = new gcp.storage.BucketIAMBinding("public-bucket-binding", {
    bucket: vulnerableGcpBucket.name,
    role: "roles/storage.objectViewer",
    members: ["allUsers"], // Public access
});

// VULNERABILITY: CloudTrail without log validation
const cloudTrailWithoutValidation = new aws.cloudtrail.Trail("trail-without-validation", {
    s3BucketName: vulnerableS3Bucket.id,
    includeGlobalServiceEvents: false, // Not including global service events
    enableLogFileValidation: false, // Log validation disabled
    isMultiRegionTrail: false, // Not multi-region
});

// VULNERABILITY: Lambda with excessive permissions
const vulnerableLambdaRole = new aws.iam.Role("vulnerable-lambda-role", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

// Attach admin policy to lambda role
const rolePolicyAttachment = new aws.iam.RolePolicyAttachment("lambda-admin-role-attachment", {
    role: vulnerableLambdaRole.name,
    policyArn: adminPolicy.arn, // Attaching the overly permissive policy
});

// VULNERABILITY: Lambda function with insecure environment variables
const vulnerableLambda = new aws.lambda.Function("vulnerable-lambda", {
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./app"),
    }),
    role: vulnerableLambdaRole.arn,
    handler: "index.handler",
    runtime: "nodejs14.x",
    environment: {
        variables: {
            "DATABASE_PASSWORD": databasePassword, // Sensitive data in environment variables
            "API_KEY": apiKey,
        },
    },
});

// Export the vulnerable resources
export const bucketName = vulnerableS3Bucket.id;
export const rdsEndpoint = vulnerableRdsInstance.endpoint;
export const ec2InstanceIp = vulnerableEc2Instance.publicIp;
export const gcpBucketUrl = vulnerableGcpBucket.url;
