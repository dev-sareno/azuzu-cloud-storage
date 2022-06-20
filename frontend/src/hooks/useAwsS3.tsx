import React, { useCallback, useContext, useEffect, useState } from "react";
import { IAuthData, IProps } from "../types/app.types";
import { S3Client } from "@aws-sdk/client-s3";
import { getAwsConfig } from "../utils/aws.utils";
import { S3UploadFileJob, S3UploadImageJob } from "../types/aws.types";
import { useNavigate } from "react-router-dom";
import { isSessionExpired } from "../utils/app.utils";

interface IAwsS3 {
  init?: (data: IAuthData) => void;
  awsS3?: S3Client;
  upload: (jobs: (S3UploadFileJob|S3UploadImageJob)[]) => void;
  hasPendingUploads: boolean;
  pendingUploads: File[];
}

const AwsS3Context = React.createContext<IAwsS3>({
  upload: (_: (S3UploadFileJob|S3UploadImageJob)[]) => {},
  hasPendingUploads: false,
  pendingUploads: [],
});

export const AwsS3Provider = (props: IProps) => {
  const [awsS3, setAwsS3] = useState<S3Client|undefined>(undefined);
  const [uploadJobs, setUploadJobs] = useState<(S3UploadFileJob|S3UploadImageJob)[]>([]);

  const navigate = useNavigate();

  const evaluateJobs = useCallback(() => {
    const nonCompletedJobs = uploadJobs.filter(j => j.getStatus() !== "completed");
    setUploadJobs(nonCompletedJobs);
  }, [uploadJobs]);

  useEffect(() => {
    const pendingJobs = uploadJobs.filter(j => j.getStatus() === "pending");
    for (const pendingJob of pendingJobs) {
      (async () => {
        try {
          await pendingJob.upload();
        } finally {
          evaluateJobs();
        }
      })();
    }
  }, [uploadJobs, evaluateJobs]);

  const initHandler = (data: IAuthData) => {
    const s3Client = new S3Client(getAwsConfig(data, "s3"));
    // add middleware
    s3Client.middlewareStack.add(
      (next, context) => async (args) => {
        try {
          return await next(args);
        } catch (e) {
          if (isSessionExpired(e)) {
            // session expired
            localStorage.clear();
            navigate('/');
            return Promise.reject('' + e);
          } else {
            // other error
            throw e;
          }
        }
      },
    );
    setAwsS3(s3Client);
  };

  const uploadHandler = (jobs: (S3UploadFileJob|S3UploadImageJob)[]) => {
    setUploadJobs(p => [...p, ...jobs]);
  };

  return (
    <AwsS3Context.Provider value={{
      init: initHandler,
      awsS3: awsS3,
      upload: uploadHandler,
      hasPendingUploads: uploadJobs.filter(j => j.getStatus() !== "completed").length > 0,
      pendingUploads: uploadJobs.filter(j => j.getStatus() !== "completed").map(u => u.getFile()),
    }}>
      {props.children}
    </AwsS3Context.Provider>
  )
};

export const useAwsS3 = () => {
  return useContext(AwsS3Context);
};