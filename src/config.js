/**
 * Basic Configuration used throughout the frontend portion of the Ignite Application
 */
export default {
    s3: {
        REGION: "YOUR_S3_UPLOADS_BUCKET_REGION",
        development: {
            BUCKET: 'ignite-dev-us-east-1'
        },
        production: {
            BUCKET: 'ignite-prod-us-east-1'
        }
    },
    apiGateway: {
        REGION: "us-east-1",
        development: {
            URL: 'https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Development'
        },
        production: {
            URL: 'https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Production'
        }
    },
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_XYjhXhc4h",
        APP_CLIENT_ID: "4nlb23tujafrmojl2hibe9u6sk",
        IDENTITY_POOL_ID: "us-east-1:18d3e90b-3f5d-43ba-b7cb-6baae3072215"
    }
};