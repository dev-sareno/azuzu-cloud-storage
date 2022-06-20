import { IAuthData } from "../types/app.types";
import { IDENTITY_POOL_ID, REGION, USER_POOL_ID } from "../contants/aws.constant";
import { ICognitoUser, IDDbS3Object } from "../types/aws.types";
import { format } from "date-fns";
import { randomString } from "./string.utils";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { cloudfrontSignS3Object } from "../api/api";

export const getCognitoLoginUrl = () => {
  const LoginBaseUrl = process.env['REACT_APP_COGNITO_AUTH_URL'] || '';
  const clientId = process.env['REACT_APP_COGNITO_USER_POOL_CLIENT_ID'] || '';
  const initRedirectUrl = process.env['REACT_APP_COGNITO_CB_INIT_URL'] || '';
  const qs = new URLSearchParams();

  qs.append('client_id', clientId);
  qs.append('response_type', 'code');
  qs.append('scope', 'email openid phone aws.cognito.signin.user.admin');
  qs.append('redirect_uri', initRedirectUrl);

  return LoginBaseUrl + '?' + qs.toString();
};

export const getCognitoLogoutUrl = () => {
  const logoutBaseUrl = process.env['REACT_APP_COGNITO_LOGOUT_URL'] || '';
  const logoutUri = process.env['REACT_APP_COGNITO_LOGOUT_URI'] || '';
  const clientId = process.env['REACT_APP_COGNITO_USER_POOL_CLIENT_ID'] || '';
  const qs = new URLSearchParams();

  qs.append('client_id', clientId);
  qs.append('response_type', 'code');
  qs.append('scope', 'email openid phone aws.cognito.signin.user.admin');
  qs.append('logout_uri', logoutUri);

  return logoutBaseUrl + '?' + qs.toString();
};

export const getAwsConfig = (data: IAuthData, resource: 's3' | 'cognito' | 'dynamoDb') => {
  const cognitoId = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
  const loginData = {
    [cognitoId]: data.idToken,
  };

  const defaultConfig = {
    clientConfig: {
      region: REGION // Configure the underlying CognitoIdentityClient.
    },
    region: REGION,
    identityPoolId: IDENTITY_POOL_ID,
    logins: {
      ...loginData
    }
  };

  switch (resource) {
    case "cognito":
      return defaultConfig;
    case "s3":
      return {
        region: REGION,
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: REGION }, // Configure the underlying CognitoIdentityClient.
          identityPoolId: IDENTITY_POOL_ID,
          logins: {
            ...loginData
          }
        })
      };
    case "dynamoDb":
      return {
        region: REGION,
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: REGION }, // Configure the underlying CognitoIdentityClient.
          identityPoolId: IDENTITY_POOL_ID,
          logins: {
            ...loginData
          }
        })
      }
    default:
      return defaultConfig;
  }
};

export const getS3FileUploadPath = (user: ICognitoUser, file: File): string => {
  let path = `data/${user.username}/files/`
  const now = new Date();
  path += format(now, 'yyyy') + '/'
  path += format(now, 'MMM') + '/'
  path += format(now, 'dd') + '/'

  // add random suffix
  let fileName = file.name;
  // normalize name
  fileName = fileName.replaceAll(' ', '_');
  fileName = fileName.replaceAll('+', '-');
  const fileExt = '.' + fileName.split('.').pop();
  const justName = fileName.replaceAll(fileExt, '');
  const withSuffix = justName + '-' + randomString(5);
  const withSuffixAndExt = withSuffix + fileExt;

  path += withSuffixAndExt;
  return path;
};

export const getFileName = (item: IDDbS3Object): string => {
  const splits = item.s3Key.split('/');
  return splits[splits.length - 1];
};