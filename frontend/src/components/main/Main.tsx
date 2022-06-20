import React from "react";
import { IProps } from "../../types/app.types";
import { Root, Thumbnails } from "./Main.styled";

const Main = (props: IProps) => {
  return (
    <Root>
      <Thumbnails id='Thumbnails' />
      {props.children}
    </Root>
  )
};

export default Main;