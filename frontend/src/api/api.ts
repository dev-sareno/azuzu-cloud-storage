import axios from "axios";
import { AuthResponse, ICloudfrontSignResponse } from "./api.types";
import { CLOUDFRONT_SIGNER_URL } from "../contants/aws.constant";
import { useQuery } from "react-query";

const instance = axios.create({
  baseURL: process.env['BASE_URL'],
});

const shouldAddAuthorization = (url: string) => {
  let result = url.startsWith(CLOUDFRONT_SIGNER_URL.toString());
  result = result && url.indexOf('Policy=') >= 0;
  return result
};

instance.interceptors.request.use((config) => {
  if (!shouldAddAuthorization(config.url || '')) {
    return config;
  }
  const savedToken = localStorage.getItem('auth') || '{}';
  const tokenObj = JSON.parse(savedToken);
  if (tokenObj.hasOwnProperty('accessToken')) {
    const accessToken = tokenObj['accessToken'];
    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const getToken = async (code: string) => {
  const qs = new URLSearchParams();
  qs.append('grant_type', 'authorization_code');
  qs.append('code', code);
  qs.append('client_id', process.env['REACT_APP_COGNITO_USER_POOL_CLIENT_ID'] || '');
  qs.append('redirect_uri', process.env['REACT_APP_COGNITO_CB_INIT_URL'] || '');
  return await instance.post<AuthResponse>(
    process.env['REACT_APP_COGNITO_AUTH_TOKEN_URL'] || '',
    qs,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
};

export const cloudfrontSignS3Object = async (s3Key: string, secret: string = 'tae') => {
  const url = CLOUDFRONT_SIGNER_URL.toString();
  const qs = new URLSearchParams();
  qs.append('s3key', s3Key);
  return await instance.get<ICloudfrontSignResponse>(
    url + '?' + qs.toString(),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        'x-api-secret': secret
      }
    }
  );
};

export const useCloudfrontSignS3Object = (s3Key: string, enabled: boolean = true) => {
  const key = 'cloudfront-sign-s3-object';
  return useQuery(
    [key, s3Key],
    () => new Promise<ICloudfrontSignResponse|undefined>(async (resolve) => {
      const cacheKey = `cf-cache-${btoa(s3Key)}`;
      // check from cache
      const cache = localStorage.getItem(cacheKey);
      if (cache) {
        try {
          // cache hit!
          const parsed = JSON.parse(cache) as ICloudfrontSignResponse;
          const searchParams = parsed.signedUrl.split('?')[1];
          const {Expires} = Object.fromEntries(new URLSearchParams(searchParams));
          const secondsRemaining = parseInt(Expires) - Date.now() / 1000;
          const fiveMinutes = 60 * 5;
          if (secondsRemaining > fiveMinutes) {
            resolve(parsed);
            return;
          } else {
            // get latest data
            // cache is expiring
            localStorage.removeItem(cacheKey);
          }
        } catch (e) {
          // failed to parse cache
          localStorage.removeItem(cacheKey);
        }
      }

      // cache missed!
      const response = await cloudfrontSignS3Object(s3Key);
      const data = response.data;
      // save to cache
      localStorage.setItem(cacheKey, JSON.stringify(data));
      resolve(data);
    }),
    {
      enabled: enabled
    }
  );
}
