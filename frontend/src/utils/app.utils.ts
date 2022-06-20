import { NotAuthorizedException } from "@aws-sdk/client-cognito-identity-provider";

export const isBrowserSafari = (): boolean => {
  const ua =  navigator.userAgent.toLowerCase();
  return ua.indexOf('chrome') === -1 && ua.indexOf('safari') > -1;
};

export const isSessionExpired = (e: any): boolean => {
  let result = e instanceof NotAuthorizedException;
  result = result && ('' + e).toLowerCase().indexOf('access token has expired') >= 0;
  return result;
};