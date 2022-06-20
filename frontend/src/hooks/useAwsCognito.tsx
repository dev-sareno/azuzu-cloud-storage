import React, { useContext, useState } from "react";
import { IAuthData, IProps } from "../types/app.types";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getAwsConfig } from "../utils/aws.utils";
import { ICognitoUser } from "../types/aws.types";
import { useNavigate } from "react-router-dom";
import { isSessionExpired } from "../utils/app.utils";

interface IAwsCognito {
  init?: (data: IAuthData) => void;
  awsCognito?: CognitoIdentityProviderClient;
  cognitoUser?: ICognitoUser;
}

const AwsCognitoContext = React.createContext<IAwsCognito>({});

export const AwsCognitoProvider = (props: IProps) => {
  const [awsCognito, setAwsCognito] = useState<CognitoIdentityProviderClient|undefined>(undefined);
  const [cognitoUser, setCognitoUser] = useState<ICognitoUser>({});

  const navigate = useNavigate();

  const initHandler = async (data: IAuthData) => {
    const cognitoClient = new CognitoIdentityProviderClient(getAwsConfig(data, "cognito"));
    // add middleware
    cognitoClient.middlewareStack.add(
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
    setAwsCognito(cognitoClient);

    try {
      const res = await cognitoClient.send(new GetUserCommand({
        AccessToken: data.accessToken
      }));
      setCognitoUser({
        username: res.Username,
        sub: res.UserAttributes?.find(i => i.Name === 'sub')?.Value,
        name: res.UserAttributes?.find(i => i.Name === 'name')?.Value,
        gender: res.UserAttributes?.find(i => i.Name === 'gender')?.Value,
        phoneNumber: res.UserAttributes?.find(i => i.Name === 'phone_number')?.Value,
        preferredUsername: res.UserAttributes?.find(i => i.Name === 'preferred_username')?.Value,
        email: res.UserAttributes?.find(i => i.Name === 'email')?.Value,
      });
    } catch (e) {
      // restart
      localStorage.clear();
      // eslint-disable-next-line no-restricted-globals
      location.href = '/';
      console.error(e);
    }
  };

  return (
    <AwsCognitoContext.Provider value={{
      init: initHandler,
      awsCognito: awsCognito,
      cognitoUser: cognitoUser,
    }}>
      {props.children}
    </AwsCognitoContext.Provider>
  )
};

export const useAwsCognito = () => {
  return useContext(AwsCognitoContext);
};