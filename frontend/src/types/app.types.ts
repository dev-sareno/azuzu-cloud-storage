import React from "react";

export interface IProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface IAuthData {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}