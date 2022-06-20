export interface AuthResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface ICloudfrontSignResponse {
  signedUrl: string;
}