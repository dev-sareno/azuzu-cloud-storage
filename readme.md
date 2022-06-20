# Azuzu Cloud Storage

## Facts
1. Static website is hosted using S3 and Cloudfront
1. Objects are stored to AWS S3
1. Uses AWS Cloudfront as CDN/Caching
1. Uses AWS Certificate Manager for SSL
1. Uses DynamoDB as database
1. Uses S3 Event to trigger an Lambda function that will write data to DynamoDB table
1. Uses AWS Lambda for creating Cloudfront Signed URL
1. Uses AWS Cognito User and Identity Pool for user authentication
1. Domain is hosted in Namecheap
