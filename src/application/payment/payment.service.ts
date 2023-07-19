import { Injectable } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';

@Injectable()
export class PaymentService {
    constructor(
        public readonly zarinpal: ZarinpalService,
    ){}
}
