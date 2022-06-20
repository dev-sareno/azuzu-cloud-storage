import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToken } from "../../api/api";
import { IAuthData } from "../../types/app.types";
import { useAuth } from "../../hooks/useAuth";
import { Root } from "./AuthInitPage.styled";

const AuthInitPage = () => {
  const [searchParams] = useSearchParams();
  const [hasError, setHasError] = useState<boolean>(false);
  const navigate = useNavigate();
  const {refresh, authData} = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      (async () => {
        const response = await getToken(code);
        const data = response.data;
        const auth = {
          idToken: data.id_token,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in,
        } as IAuthData;

        // save
        localStorage.setItem('auth', JSON.stringify(auth));
        refresh();

        setTimeout(() => {
          navigate('/', {replace: true});
        }, 200);
      })();
    } else {
      console.error('Missing code');
      setHasError(true);
    }
  }, [searchParams, navigate, refresh, authData]);

  return (
    <Root>
      {hasError ? 'Something went wrong' : 'Logging in...'}
    </Root>
  );
};

export default AuthInitPage;