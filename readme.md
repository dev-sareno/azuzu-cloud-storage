# Azuzu Cloud Storage
A simple file storage built with ReactJS and AWS services. Highly available and purely serverless!

## Background
I built this personal project to practically exercise my knowledge in AWS after passing the following certificates
![AWS Developer](images/developer.png)
![AWS Solution Architect](images/solution-architect.png)
![AWS Cloud Practitioner](images/cloud-practitioner.png)
1. [AWS Certified Developer](https://www.credly.com/badges/2d54fca2-63b0-4fbf-9241-03b4aeb42b41/public_url)
2. [AWS Certified Solutions Architect](https://www.credly.com/badges/57841524-7f5e-4e64-b6eb-3454c69b2592/public_url)
3. [AWS Certified Cloud Practitioner](https://www.credly.com/badges/a5c4fb43-f22c-40c3-b1aa-941ef58f4eb3/public_url)

## About the Project
1. Static website is hosted using S3 and Cloudfront
1. Objects are stored in AWS S3
1. Uses AWS Cloudfront as CDN/Caching
1. Uses AWS Certificate Manager for SSL
1. Uses DynamoDB as database
1. Uses S3 Event to trigger a Lambda function that writes data to DynamoDB table
1. Uses AWS Lambda for creating Cloudfront Signed URL
1. Uses AWS Cognito User and Identity Pool for user authentication
1. Domain name is hosted in Namecheap

## Screens
![screen 01](images/ss01.png)
![screen 02](images/ss02.png)
![screen 03](images/ss03.png)
![screen 04](images/ss04.png)
![screen 05](images/ss05.png)
![screen 06](images/ss06.png)
![screen 07](images/ss07.png)
![screen 08](images/ss08.png)
