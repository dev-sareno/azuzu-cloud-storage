import React, { useEffect, useState } from "react";
import { Root } from "./Photos.styled";
import { useAwsDynamoDb } from "../../hooks/useAwsDynamoDb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DDB_TABLE_NAME} from "../../contants/aws.constant";
import { useAwsCognito } from "../../hooks/useAwsCognito";
import { IDDbS3Object } from "../../types/aws.types";
import Button from "../button/Button";
import ImageS3Openable from "../image-s3-openable/ImageS3Openable";

const Photos = () => {
  const {awsDynamoDb} = useAwsDynamoDb();
  const {cognitoUser} = useAwsCognito();

  const [photoItems, setPhotoItems] = useState<IDDbS3Object[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<any|undefined>(undefined);
  const [nextPageData, setNextPageData] = useState<any|undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (awsDynamoDb && cognitoUser && cognitoUser.username) {
        let params = {
          TableName: DDB_TABLE_NAME,
          IndexName: 'timestamp-index',
          ScanIndexForward: false,
          Limit: 100,
          ExclusiveStartKey: lastEvaluatedKey,
          KeyConditionExpression: "username = :un",
          FilterExpression: "attribute_exists(#attr_tk)",
          ExpressionAttributeNames: {
            '#attr_tk': 'thumbnailKey'
          },
          ExpressionAttributeValues: {
            ":un": { S: cognitoUser.username },
          },
        };
        const cmd = new QueryCommand(params);
        const response = await awsDynamoDb.send(cmd);

        setNextPageData(response.LastEvaluatedKey);

        const items = response.Items;
        if (items) {
          const mapped = items.map(i => ({
            username: i['username'].S,
            s3Key: i['s3Key'].S,
            timestamp: parseFloat(i['timestamp'].N || '0'),
            fileExtension: i['fileExtension'].S,
            fileSize: parseInt(i['fileSize'].N || '0'),
            thumbnailKey: i.hasOwnProperty('thumbnailKey') ? i['thumbnailKey'].S : undefined,
          } as IDDbS3Object));
          setPhotoItems(mapped);
        }
      }
    })();
  }, [awsDynamoDb, cognitoUser, lastEvaluatedKey]);

  const onLoadMoreClickedHandler = () => {
    if (nextPageData) {
      setLastEvaluatedKey(nextPageData);
    } else {
      console.log('end of page');
    }
  };

  return (
    <Root className={'mt-20'}>
      <div className={'flex flex-row flex-wrap'}>
        {photoItems.map((p, i) => (
          <ImageS3Openable key={i} photoItem={p} />
        ))}
      </div>
      {photoItems && nextPageData && (
        <div className={'mt-20 flex flex-row contents-end'}>
          <Button text={'Load more'} size={"xs"} type={"simple"} onClick={onLoadMoreClickedHandler} />
        </div>
      )}
    </Root>
  )
};

export default Photos;