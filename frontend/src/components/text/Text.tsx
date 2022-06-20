import React from "react";
import { IProps } from "../../types/app.types";
import { Root } from "./Text.styled";

interface ITextProps extends IProps {
  text: string;
  align?: 'left' | 'center' | 'right';
  size?: 'xs' | 'small' | 'normal' | 'large' | 'xl';
}

const Text = (props: ITextProps) => {
  const {
    className,
    text,
    align,
    size,
  } = props;

  return (
    <Root
      className={className}
      align={align || 'left'}
      size={size || 'normal'}>
      {text}
    </Root>
  )
};

export default Text;