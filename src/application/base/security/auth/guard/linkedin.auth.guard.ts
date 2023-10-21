import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedinGuardAuth extends AuthGuard('linkedIn') {
  // constructor(private configService: ConfigService) {
  //   super({
  //     accessType: 'offline',
  //   });
  // }
}
