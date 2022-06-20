import React, { useContext, useState } from "react";
import { IAuthData, IProps } from "../types/app.types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getAwsConfig } from "../utils/aws.utils";
import { useNavigate } from "react-router-dom";
import { isSessionExpired } from "../utils/app.utils";

interface IAwsDynamoDb {
  init?: (data: IAuthData) => void;
  awsDynamoDb?: DynamoDBClient;
}

const AwsDynamoDbContext = React.createContext<IAwsDynamoDb>({});

export const AwsDynamoDbProvider = (props: IProps) => {
  const [dynamoDbClient, setDynamoDbClient] = useState<DynamoDBClient|undefined>(undefined);

  const navigate = useNavigate();

  const initHandler = (data: IAuthData) => {
    const ddbClient = new DynamoDBClient(getAwsConfig(data, "dynamoDb"));
    // add middleware
    ddbClient.middlewareStack.add(
      (next, context) => async (args) => {
        try {
          return await next(args);
        } catch (e) {
          if (isSessionExpired(e)) {
            // session expired
            localStorage.clear();
            navigate('/');
            return Promise.reject('' + e);
          } else {
            // other error
            throw e;
          }
        }
      },
    );
    setDynamoDbClient(ddbClient);
  };

  return (
    <AwsDynamoDbContext.Provider value={{
      init: initHandler,
      awsDynamoDb: dynamoDbClient,
    }}>
      {props.children}
    </AwsDynamoDbContext.Provider>
  )
};

export const useAwsDynamoDb = () => {
  return useContext(AwsDynamoDbContext);
};