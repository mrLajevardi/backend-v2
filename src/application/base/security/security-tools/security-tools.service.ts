import { Injectable } from '@nestjs/common';
import { OtpService } from './otp.service';

@Injectable()
export class SecurityToolsService {
  constructor(public readonly otp: OtpService) {}
}
