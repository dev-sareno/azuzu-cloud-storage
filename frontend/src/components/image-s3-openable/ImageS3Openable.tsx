import React, { useEffect, useState } from "react";
import { IProps } from "../../types/app.types";
import { Root, StyledImage } from "./ImageS3Openable.styled";
import { IDDbS3Object } from "../../types/aws.types";
import { useCloudfrontSignS3Object } from "../../api/api";

interface IS3OpenableProps extends IProps {
  photoItem: IDDbS3Object;
}

const ImageS3Openable = (props: IS3OpenableProps) => {
  const {
    photoItem
  } = props;

  const [signedImageUrl, setSignedImageUrl] = useState<string|undefined>(undefined);
  const [signedThumbnailUrl, setSignedThumbnailUrl] = useState<string|undefined>(undefined);

  const {data: dThumbnail} = useCloudfrontSignS3Object(photoItem.thumbnailKey || '', !!photoItem.thumbnailKey);
  const {data: dImage} = useCloudfrontSignS3Object(photoItem.s3Key);

  useEffect(() => {
    if (dThumbnail) {
      setSignedThumbnailUrl(dThumbnail.signedUrl);
    }
  }, [dThumbnail]);

  useEffect(() => {
    if (dImage) {
      setSignedImageUrl(dImage.signedUrl);
    }
  }, [dImage]);

  return (
    <Root>
      {signedImageUrl && (
        <a href={signedImageUrl} target={'_blank'}>
          <StyledImage src={signedThumbnailUrl} alt="" />
        </a>
      )}
      {!signedImageUrl && (
        <StyledImage src={signedThumbnailUrl} alt="" />
      )}
    </Root>
  )
};

export default ImageS3Openable;