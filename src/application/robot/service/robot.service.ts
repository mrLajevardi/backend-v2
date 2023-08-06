import { Injectable } from '@nestjs/common';
import { CheckServiceService } from './check-service.service';
import { PaygInvoiceService } from './payg-invoice.service';
import { VgpuPayAsYouGoService } from './vgpu-pay-as-you-go.service';

@Injectable()
export class RobotService {
  constructor(
    public readonly checkService: CheckServiceService,
    public readonly paygInvoice: PaygInvoiceService,
    public readonly vgpuPayAsYouGo: VgpuPayAsYouGoService,
  ) {}
}
