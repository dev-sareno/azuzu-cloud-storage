import React, { useEffect, useState } from "react";
import { Root } from "./ImagePreview.styled";
import { IProps } from "../../types/app.types";
import Text from "../text/Text";
import { fileToDataURL } from "../../utils/image.utils";

interface IImagePreviewProps extends IProps {
  file: File,
  onLoad?: (_: React.MouseEvent<HTMLImageElement>) => void;
}

const ImagePreview = (props: IImagePreviewProps) => {
  const {
    file,
    className,
    onLoad,
  } = props;

  const [imgSrc, setImgSrc] = useState<string|undefined>(undefined);

  useEffect(() => {
    (async () => {
      const result = await fileToDataURL(file);
      setImgSrc(result);
    })();
  }, [file]);

  const onImageLoadHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    onLoad && onLoad(e);
  };

  return (
    <Root className={['flex flex-row items-center', className].join(' ')}>
      <div className={'img-wrapper'}>
        {imgSrc && (
          <img id={file.name} width={32} height={32} onLoad={onImageLoadHandler} src={imgSrc} alt={file.name} />
        )}
      </div>
      <Text text={file.name} size={"xs"} className={'ml-10'} />
    </Root>
  )
};

export default ImagePreview;