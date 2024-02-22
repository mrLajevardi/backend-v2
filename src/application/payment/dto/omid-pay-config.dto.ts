import process from 'process';

export interface OmidPayConfigDto {
  WSContext: WSContext;
  TransType?: string;
  ReserveNum?: string;
  MerchantId?: string;
  Amount?: string;
  RedirectUrl?: string;
  Token?: string;
  RefNum?: string;
}

interface WSContext {
  UserId: string;
  Password: string;
}
