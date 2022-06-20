import React, { useEffect, useState } from "react";
import Page from "../page/Page";
import { Root } from "./UploadPage.styled";
import Text from "../../components/text/Text";
import FilePreview from "../../components/file-preview/FilePreview";
import ImagePreview from "../../components/image-preview/ImagePreview";
import Button from "../../components/button/Button";
import { useAwsCognito } from "../../hooks/useAwsCognito";
import { useAwsS3 } from "../../hooks/useAwsS3";
import { S3Status, S3UploadFileJob, S3UploadImageJob } from "../../types/aws.types";
import { isSupportedImage } from "../../utils/image.utils";
import { useNavigate } from "react-router-dom";

interface IImageThumbnail {
  file: File,
  imageElement: React.MouseEvent<HTMLImageElement>,
}

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {cognitoUser} = useAwsCognito();
  const {
    hasPendingUploads,
    upload: s3Upload,
    awsS3
  } = useAwsS3();
  const navigate = useNavigate();

  const elemInputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    if (elemInputRef && files.length === 0) {
      if (elemInputRef.current) {
        elemInputRef.current.value = '';
      }
    }
  }, [files, elemInputRef]);

  useEffect(() => {
    setIsUploading(hasPendingUploads);
  }, [hasPendingUploads]);

  const onFilesSelectedHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files;
    if (f) {
      const mapFiles = [];
      const mapImageFiles = [];
      for (let i = 0; i < f.length; i++) {
        const file = f[i];
        mapFiles.push(file);
        if (isSupportedImage(file.type)) {
          mapImageFiles.push(file);
        }
      }
      setFiles(mapFiles);
    }
  };

  const onSubmitUploadClickedHandler = () => {
    if (!isUploading && files.length > 0 && awsS3 && cognitoUser) {
      const jobs = files.map(file => {
        if (isSupportedImage(file.type)) {
          return new S3UploadImageJob(
            awsS3,
            cognitoUser,
            file,
          );
        } else {
          return new S3UploadFileJob(
            awsS3,
            cognitoUser,
            file,
          );
        }
      });
      s3Upload(jobs);
      setFiles([]);
      navigate('/upload-status');
    }
  };

  const onRemoveFileClickedHandler = (file: File) => {
    setFiles(p => p.filter(i => i !== file));
  };

  return (
    <Page hasHeader hasUploadButton={false}>
      <Root>
        <Text text={'Upload new files'} />
        <div className={'upload-container flex flex-row items-center'}>
          <input
            ref={elemInputRef}
            className={'flex-3'}
            type={"file"}
            multiple
            onInput={onFilesSelectedHandler} />
          {files.length > 0 && (
            <div className={'flex-1 flex flex-row contents-end ml-10'}>
              <Button
                text={'Submit'}
                size={"small"}
                onClick={onSubmitUploadClickedHandler} />
            </div>
          )}
        </div>

        <div className="preview mt-20">
          {files.map((f, i) => (
            <div key={i} className={'flex flex-row items-center'}>
              <div className={'flex-1'}>
                {isSupportedImage(f.type) && (
                  <ImagePreview
                    className={'mt-10'}
                    file={f} />
                )}
                {!isSupportedImage(f.type) && (<FilePreview className={'mt-10'} file={f} />)}
              </div>

              <div className={'ml-10 flex flex-row contents-end'}>
                <Button
                  text={isUploading ? 'uploading..' : 'remove'}
                  disabled={isUploading}
                  size={"xs"}
                  onClick={() => onRemoveFileClickedHandler(f)}
                  type={"simple"} />
              </div>
            </div>
          ))}
        </div>
      </Root>
    </Page>
  )
};

export default UploadPage;