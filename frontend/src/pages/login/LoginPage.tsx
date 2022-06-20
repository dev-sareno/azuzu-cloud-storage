import React from "react";
import { Root } from "./LoginPage.styled";
import Button from "../../components/button/Button";
import { getCognitoLoginUrl } from "../../utils/aws.utils";
import Text from "../../components/text/Text";
import cloudLogo from "../../assets/cloud-logo.png";

const LoginPage = () => {
  const onLoginClickHandler = () => {
    window.location.href = getCognitoLoginUrl();
  };

  return (
    <Root className={'px-20'}>
      <div className={'wrapper'}>
        <div className={'title flex flex-col items-center'}>
          <img src={cloudLogo} width={150} height={150} alt={'cloud-logo'} />
          <Text
            className={'mb-20'}
            text={'Azuzu Cloud Storage'}
            align={'center'}
            size={"large"} />
        </div>

        <Button
          text={'Login'}
          onClick={onLoginClickHandler} />
      </div>
    </Root>
  )
};

export default LoginPage;