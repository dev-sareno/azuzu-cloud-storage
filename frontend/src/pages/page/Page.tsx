import React, { useEffect } from "react";
import { IProps } from "../../types/app.types";
import { Root } from "./Page.styled";
import Header from "../../components/header/Header";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getCognitoLogoutUrl } from "../../utils/aws.utils";

interface IPageProps extends IProps {
  hasHeader?: boolean;
  hasUploadButton?: boolean;
  hasHomeButton?: boolean;
}

const Page = (props: IPageProps) => {
  const {
    children,
    hasHeader,
    hasUploadButton,
    hasHomeButton,
  } = props;

  const {authData, isInitialized} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized) {
      if (!authData) {
        window.location.href = getCognitoLogoutUrl();
      }
    }
  }, [authData, isInitialized, navigate]);

  return (
    <Root>
      {(hasHeader || hasHeader === undefined) && (
        <Header
          hasUploadButton={hasUploadButton}
          hasHomeButton={hasHomeButton} />
      )}
      {children}
    </Root>
  )
};

export default Page;