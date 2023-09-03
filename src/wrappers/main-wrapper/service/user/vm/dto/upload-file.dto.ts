export interface UploadFileDto {
  name: string;
  imageType: string;
  size: number;
}

export class UploadFileReturnDto {
  transferId: string;
}
