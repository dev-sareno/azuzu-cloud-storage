import React, { useEffect, useState } from "react";
import { Root } from "./Button.styled";
import { IProps } from "../../types/app.types";

interface IButtonProps extends IProps {
  text: string;
  size?: 'xs' | 'small' | 'normal';
  type?: 'normal' | 'simple';
  disabled?: boolean;
}

const Button = (props: IButtonProps) => {
  const {
    text,
    onClick,
    className,
    size,
    type,
    disabled: pDisabled,
  } = props;

  const [disabled, setDisabled] = useState<boolean>(pDisabled === true);

  useEffect(() => {
    setDisabled(pDisabled === true);
  }, [pDisabled]);

  const onClickHandler = () => {
    !disabled && onClick && onClick();
  };

  return (
    <Root
      disabled={disabled}
      size={size || "normal"}
      type={type || 'normal'}
      className={className}
      onClick={onClickHandler}>
      {text}
    </Root>
  )
};

export default Button;