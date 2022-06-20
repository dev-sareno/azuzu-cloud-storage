import React, { useCallback, useContext, useEffect, useState } from "react";
import { IAuthData, IProps } from "../types/app.types";
import { useAwsCognito } from "./useAwsCognito";
import { useAwsS3 } from "./useAwsS3";
import { useAwsDynamoDb } from "./useAwsDynamoDb";

interface IAuthContext {
  authData?: IAuthData;
  refresh: () => void;
  isInitialized: boolean;
}

const AuthContext = React.createContext<IAuthContext>({
  refresh: () => {},
  isInitialized: false,
});

export const AuthProvider = (props: IProps) => {
  const [authData, setAuthData] = useState<IAuthData|undefined>(undefined);
  const [isInitialized, setIsInitialed] = useState<boolean>(false);

  const {init: initAwsS3} = useAwsS3();
  const {init: initAwsCognito} = useAwsCognito();
  const {init: initDynamoDb} = useAwsDynamoDb();

  const refreshHandler = useCallback(() => {
    const saved = localStorage.getItem('auth') || '{}';
    const parsed = JSON.parse(saved) as IAuthData;
    if (Object.keys(parsed).length > 0) {
      setAuthData(parsed);

      // init
      initAwsS3 && initAwsS3(parsed);
      initAwsCognito && initAwsCognito(parsed);
      initDynamoDb && initDynamoDb(parsed);
    } else {
      setAuthData(undefined);
    }
    setIsInitialed(true);
  }, [initAwsS3, initAwsCognito, initDynamoDb]);

  useEffect(() => {
    if (!isInitialized) {
      refreshHandler();
    }
  }, [isInitialized, refreshHandler]);

  return (
    <AuthContext.Provider value={{
      authData: authData,
      refresh: refreshHandler,
      isInitialized: isInitialized,
    }}>
      {props.children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  return useContext(AuthContext);
};