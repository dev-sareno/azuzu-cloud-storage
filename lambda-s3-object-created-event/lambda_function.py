import json
import os
import boto3
from datetime import datetime
from decimal import Decimal

DDB_TABLE = os.environ['DYNAMODB_TABLE']

# Get the service resource.
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(DDB_TABLE)


def lambda_handler(event, context):
    print('event=' + json.dumps(event))
    save_count = 0
    records = event['Records']
    for i, record in enumerate(records):
        try:
            event_time = record['eventTime']
            s3_key = record['s3']['object']['key']
            
            username = s3_key.split('/')[1]
            timestamp = Decimal(str(datetime.strptime(event_time, "%Y-%m-%dT%H:%M:%S.%fZ").timestamp()))
            path = s3_key
            file_extension = s3_key.split('.')[-1]
            file_size = record['s3']['object']['size']
            
            table.put_item(
               Item={
                    'username': username,
                    'timestamp': timestamp,
                    's3Key': path,
                    'fileExtension': file_extension,
                    'fileSize': file_size,
                }
            )
            
            if '/thumbnails/' in s3_key:
                # update db item
                parent_s3_key = s3_key.replace('/thumbnails/', '/files/')
                table.update_item(
                    Key={
                        'username': username,
                        's3Key': parent_s3_key,
                    },
                    UpdateExpression="SET thumbnailKey=:thumbnailKey",
                    ExpressionAttributeValues={
                        ':thumbnailKey': s3_key,
                    },
                    ReturnValues="NONE"
                )
            save_count += 1
        except Exception as e:
            print(f'failed to proces item at index {i}; error=' + str(e))
    
    return {
        'statusCode': 200,
        'body': f'{save_count}/{len(records)} items were saved to DynamoDb!'
    }
