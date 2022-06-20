import React, { useEffect, useState } from "react";
import { IProps } from "../../types/app.types";
import { Root, StyledLink } from "./FileS3Openable.styled";
import { getFileName} from "../../utils/aws.utils";
import { IDDbS3Object } from "../../types/aws.types";
import Text from "../text/Text";
import { useCloudfrontSignS3Object } from "../../api/api";

interface IFileS3OpenableProps extends IProps {
  data: IDDbS3Object;
}

const FileS3Openable = (props: IFileS3OpenableProps) => {
  const {
    data,
    onClick
  } = props;

  const [signedUrl, setSignedUrl] = useState<string|undefined>(undefined);
  const {data: dSignedUrl} = useCloudfrontSignS3Object(data.s3Key);

  useEffect(() => {
    if (dSignedUrl) {
      setSignedUrl(dSignedUrl.signedUrl);
    }
  }, [dSignedUrl]);

  const onClickedHandler = () => {
    onClick && onClick();
  };

  return (
    <Root onClick={onClickedHandler} isClickable={!!signedUrl}>
      {signedUrl && (
        <StyledLink href={signedUrl} target={'_blank'}>
          <Text text={getFileName(data)} size={"xs"} />
        </StyledLink>
      )}
      {!signedUrl && (
        <Text text={getFileName(data)} size={"xs"} />
      )}
    </Root>
  )
};

export default FileS3Openable;