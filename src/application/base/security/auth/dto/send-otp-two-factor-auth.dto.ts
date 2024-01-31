import { ApiResponseProperty } from '@nestjs/swagger';

export interface BaseSendTwoFactorAuthDto {
  hash?: string;
  qrCode?: string;
}

export class SendOtpTwoFactorAuthDto implements BaseSendTwoFactorAuthDto {
  @ApiResponseProperty({
    type: String,
    example:
      'd1a1be46c52e56e1d0c08e6b64bd1f422939abeccad07451ca0070062b33cb89.1706424941565',
  })
  hash: string;
}

export class SendQrCodeTwoFactorAuthDto implements BaseSendTwoFactorAuthDto {
  qrCode: string;
}

export class BaseSendTwoFactorAuthDtoSwagger {
  @ApiResponseProperty({
    type: String,
    example:
      'd1a1be46c52e56e1d0c08e6b64bd1f422939abeccad07451ca0070062b33cb89.1706424941565',
  })
  hash: string;

  @ApiResponseProperty({
    type: String,
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAADECAYAAADApo5rAAAAAklEQVR4AewaftIAAAjwSURBVO3BQYolyZIAQdUg739lnWYWjq0cgveyqvtjIvYP1lr/ ...',
  })
  qrcode: string;
}
