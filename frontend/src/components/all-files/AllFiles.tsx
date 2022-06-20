import React, { useEffect, useState } from "react";
import { Root } from "./AllFiles.styled";
import { useAwsDynamoDb } from "../../hooks/useAwsDynamoDb";
import { useAwsCognito } from "../../hooks/useAwsCognito";
import { IDDbS3Object } from "../../types/aws.types";
import { DDB_TABLE_NAME } from "../../contants/aws.constant";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import Button from "../button/Button";
import FileS3Openable from "../file-s3-openable/FileS3Openable";

const AllFiles = () => {
  const {awsDynamoDb} = useAwsDynamoDb();
  const {cognitoUser} = useAwsCognito();

  const [s3Items, setS3Items] = useState<IDDbS3Object[]>([]);
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
          FilterExpression: "begins_with(#s3Key, :filePrefix)",
          ExpressionAttributeNames: {
            '#s3Key': 's3Key'
          },
          ExpressionAttributeValues: {
            ":un": { S: cognitoUser.username },
            ':filePrefix': {S: `data/${cognitoUser.username}/files/`}
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
          setS3Items(p => [...p, ...mapped]);
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
    <Root>
      <div className={'mt-20'}>
        {s3Items.map((item, i) => (
          <FileS3Openable key={i} data={item} />
        ))}
      </div>
      {s3Items && nextPageData && (
        <div className={'mt-20 flex flex-row contents-end'}>
          <Button text={'Load more'} size={"xs"} type={"simple"} onClick={onLoadMoreClickedHandler} />
        </div>
      )}
    </Root>
  )
};

export default AllFiles;