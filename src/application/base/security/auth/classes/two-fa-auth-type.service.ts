import { Injectable } from '@nestjs/common';
import { TwoFaAuthSmsService } from './two-fa-auth-sms.service';
import { TwoFaAuthEmailService } from './two-fa-auth-email.service';

@Injectable()
export class TwoFaAuthTypeService {
  constructor(
    public readonly sms: TwoFaAuthSmsService,
    public readonly email: TwoFaAuthEmailService,
  ) {}
}
