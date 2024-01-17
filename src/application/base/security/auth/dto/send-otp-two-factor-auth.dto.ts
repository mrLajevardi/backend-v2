export interface BaseSendTwoFactorAuthDto {
  hash?: string;
  qrCode?: string;
}

export class SendOtpTwoFactorAuthDto implements BaseSendTwoFactorAuthDto {
  hash: string;
}

export class SendQrCodeTwoFactorAuthDto implements BaseSendTwoFactorAuthDto {
  qrCode: string;
}
