import React from "react";
import { IProps } from "../../types/app.types";
import { Root } from "./FilePreview.styled";
import fileImg from "../../assets/folder.png";
import Text from "../text/Text";

interface IFilePreviewProps extends IProps {
  file: File
}

const FilePreview = (props: IFilePreviewProps) => {
  const {
    file,
    className,
  } = props;

  return (
    <Root className={['flex flex-row items-center', className].join(' ')}>
      <img width={32} height={32} src={fileImg} alt={'file'} />
      <Text text={file.name} size={"xs"} className={'ml-10'} />
    </Root>
  )
};

export default FilePreview;