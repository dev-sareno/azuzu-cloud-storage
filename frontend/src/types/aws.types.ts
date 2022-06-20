import { createThumbnail } from "../utils/image.utils";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME } from "../contants/aws.constant";
import { getS3FileUploadPath} from "../utils/aws.utils";
import {Buffer} from 'buffer';

export interface ICognitoUser {
  username?: string;
  sub?: string;
  name?: string;
  gender?: string;
  phoneNumber?: string;
  preferredUsername?: string;
  email?: string;
}

export type S3Status = 'pending' | 'in-progress' | 'completed' | 'failed';

export class S3UploadFileJob {
  protected readonly s3Client: S3Client;
  protected readonly user: ICognitoUser;
  protected readonly file: File;
  protected handler?: (_: S3Status, file: File) => void;
  protected status: S3Status;
  private readonly s3Key: string;

  constructor(
    s3Client: S3Client,
    user: ICognitoUser,
    file: File,
    handler: ((_: S3Status, file: File) => void)|undefined = undefined,
  ) {
    this.s3Client = s3Client;
    this.user = user;
    this.file = file;
    this.handler = handler;
    this.status = 'pending';
    this.s3Key = getS3FileUploadPath(user, file);
  }

  public setHandler(handler: (_: S3Status, file: File) => void) {
    this.handler = handler;
  }

  public getS3Key(): string {
    return this.s3Key;
  }

  public getFile(): File {
    return this.file;
  }

  public getStatus(): S3Status {
    return this.status;
  }

  protected setStatus(status: S3Status) {
    this.status = status;
    this.handler && this.handler(status, this.file);
  }

  public async upload(setStatusToComplete: boolean = true) {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: this.s3Key,
      Body: Buffer.from(await this.file.arrayBuffer()),
      ContentType: this.file.type
    });

    this.setStatus('in-progress');
    try {
      // upload
      await this.s3Client.send(command);
    } catch (e) {
      console.log('upload file failed', e);
      this.setStatus('failed');
    }

    if (setStatusToComplete) {
      this.setStatus('completed');
    }
  }
}

export class S3UploadImageJob extends S3UploadFileJob {
  private isThumbnailProcessed: boolean = false;
  private thumbnailData: string|undefined = undefined;
  private isUploadInitiated: boolean = false;

  constructor(
    s3Client: S3Client,
    user: ICognitoUser,
    file: File,
    handler: ((_: S3Status, file: File) => void)| undefined = undefined,
  ) {
    super(s3Client, user, file, handler);

    // load thumbnail
    (async () => {
      await this.generateThumbnail();
    })();
  }

  private async generateThumbnail() {
    try {
      this.thumbnailData = await createThumbnail(this.file);
    } catch (e) {
      this.thumbnailData = undefined;
    } finally {
      this.isThumbnailProcessed = true;

      if (this.isUploadInitiated) {
        await this.proceedUploadThumbnail();
      }
    }
  }

  private async proceedUploadThumbnail() {
    try {
      await this.uploadImageThumbnail();
    } catch (e) {
      // ignore thumbnail upload failed
      console.log('upload thumbnail failed', e);
    } finally {
      this.setStatus('completed');
    }
  }

  public async uploadImageThumbnail() {
    const thumbnailKey = this.getS3Key()
      .replaceAll(`data/${this.user.username}/files/`, `data/${this.user.username}/thumbnails/`)
    const data = this.thumbnailData!!;
    const buf = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""),'base64');
    const imageType = data.split(';')[0].split(':')[1];
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: thumbnailKey,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: imageType,
    });

    this.setStatus('in-progress');
    try {
      // upload
      await this.s3Client.send(command);
    } catch (e) {
      console.log('upload thumbnail failed', e);
      this.setStatus('failed');
    }
  }

  async upload(): Promise<void> {
    await super.upload(false);

    if (this.isThumbnailProcessed) {
      await this.proceedUploadThumbnail();
    } else {
      this.isUploadInitiated = true;
    }
  }
}

export interface IDDbS3Object {
  username: string;
  s3Key: string;
  timestamp: number;
  fileExtension: string;
  fileSize: number;
  thumbnailKey?: string;
}