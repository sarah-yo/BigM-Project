import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// VULNERABILITY: DynamoDB table without encryption
const vulnerableDynamoTable = new aws.dynamodb.Table("vulnerable-dynamo-table", {
    attributes: [{
        name: "id",
        type: "S",
    }],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST",
    // No server-side encryption specified
});

// VULNERABILITY: API Gateway without authentication
const vulnerableApiGateway = new aws.apigateway.RestApi("vulnerable-api", {
    description: "Vulnerable API Gateway",
});

const vulnerableApiResource = new aws.apigateway.Resource("vulnerable-resource", {
    restApi: vulnerableApiGateway.id,
    parentId: vulnerableApiGateway.rootResourceId,
    pathPart: "vulnerable",
});

// VULNERABILITY: Method without authorization
const vulnerableMethod = new aws.apigateway.Method("vulnerable-method", {
    restApi: vulnerableApiGateway.id,
    resourceId: vulnerableApiResource.id,
    httpMethod: "GET",
    authorization: "NONE", // No authorization
});

// VULNERABILITY: SNS topic without encryption
const vulnerableSNSTopic = new aws.sns.Topic("vulnerable-sns-topic", {
    // No KMS key specified for encryption
});

// VULNERABILITY: SQS queue without encryption
const vulnerableSQSQueue = new aws.sqs.Queue("vulnerable-sqs-queue", {
    // No KMS key specified for encryption
});

// VULNERABILITY: ECR repository without scan on push
const vulnerableEcrRepo = new aws.ecr.Repository("vulnerable-ecr-repo", {
    imageScanningConfiguration: {
        scanOnPush: false, // Scanning disabled
    },
});

// VULNERABILITY: KMS key with weak rotation policy
const vulnerableKmsKey = new aws.kms.Key("vulnerable-kms-key", {
    description: "Vulnerable KMS key",
    enableKeyRotation: false, // Key rotation disabled
});

// VULNERABILITY: ElastiCache Redis without encryption or auth
const vulnerableRedisCluster = new aws.elasticache.Cluster("vulnerable-redis", {
    engine: "redis",
    engineVersion: "5.0.6",
    nodeType: "cache.t2.micro",
    numCacheNodes: 1,
    port: 6379,
    // No auth token specified
    // No encryption in transit
    // No encryption at rest
});

// VULNERABILITY: EBS volume without encryption
const vulnerableEbsVolume = new aws.ebs.Volume("vulnerable-ebs-volume", {
    availabilityZone: "us-west-2a",
    size: 10,
    encrypted: false, // Explicitly disabled encryption
});

// VULNERABILITY: CloudFront distribution without secure settings
const vulnerableCloudFront = new aws.cloudfront.Distribution("vulnerable-cloudfront", {
    origins: [{
        domainName: vulnerableS3Bucket.bucketRegionalDomainName,
        originId: "s3Origin",
        customOriginConfig: {
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: "http-only", // Only HTTP, not HTTPS
            originSslProtocols: ["TLSv1"], // Outdated SSL protocol
        },
    }],
    defaultCacheBehavior: {
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        targetOriginId: "s3Origin",
        forwardedValues: {
            queryString: false,
            cookies: {
                forward: "none",
            },
        },
        viewerProtocolPolicy: "allow-all", // Allows HTTP instead of requiring HTTPS
        minTtl: 0,
        defaultTtl: 3600,
        maxTtl: 86400,
    },
    enabled: true,
    restrictions: {
        geoRestriction: {
            restrictionType: "none",
            locations: [],
        },
    },
    viewerCertificate: {
        cloudfrontDefaultCertificate: true, // Using default cert instead of custom
    },
});

// Export the vulnerable resources
export const dynamoTableName = vulnerableDynamoTable.name;
export const apiGatewayUrl = vulnerableApiGateway.executionArn;
export const snsTopicArn = vulnerableSNSTopic.arn;
export const sqsQueueUrl = vulnerableSQSQueue.url;
