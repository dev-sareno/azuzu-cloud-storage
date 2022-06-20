import React from "react";
import { Root } from "./UploadStatusPage.styled";
import Text from "../../components/text/Text";
import { useAwsS3 } from "../../hooks/useAwsS3";
import Page from "../page/Page";

const UploadStatusPage = () => {
  const {pendingUploads} = useAwsS3();
  return (
    <Page hasHeader hasUploadButton>
      <Root>
        <Text text={pendingUploads.length > 0 ? 'Uploading files..' : 'No ongoing uploads'} />
        <div className={'mt-20'}>
          {pendingUploads.map((pu, i) => (
            <Text key={i} text={pu.name} size={"xs"} />
          ))}
        </div>
      </Root>
    </Page>
  )
};

export default UploadStatusPage;