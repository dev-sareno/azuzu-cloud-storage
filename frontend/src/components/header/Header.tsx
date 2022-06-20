import React from "react";
import { Root } from "./Header.styled";
import Button from "../button/Button";
import { getCognitoLogoutUrl } from "../../utils/aws.utils";
import { useNavigate } from "react-router-dom";
import { IProps } from "../../types/app.types";

interface IHeaderProps extends IProps {
  hasUploadButton?: boolean;
  hasHomeButton?: boolean;
}

const Header = (props: IHeaderProps) => {
  const {
    hasUploadButton,
    hasHomeButton,
  } = props;

  const navigate = useNavigate();

  const logoutClickHandler = () => {
    // eslint-disable-next-line no-restricted-globals
    const proceedLogout = confirm('Proceed logout?');
    if (proceedLogout) {
      window.location.href = getCognitoLogoutUrl();
    }
  };

  const uploadClickHandler = () => {
    navigate('/upload');
  };

  const homeClickHandler = () => {
    navigate('/');
  };

  return (
    <Root className={'w-full flex flex-row items-end'}>
      <div className={'flex-1 flex flex flex-row'}>
        {hasHomeButton !== false && (
          <Button text={'Home'} onClick={homeClickHandler} />
        )}
        {hasUploadButton !== false && (
          <Button text={'Upload'} onClick={uploadClickHandler} />
        )}
      </div>
      <div>
        <Button text={'Logout'} onClick={logoutClickHandler} />
      </div>
    </Root>
  )
};

export default Header;