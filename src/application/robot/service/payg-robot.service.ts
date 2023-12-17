import { Injectable } from '@nestjs/common';
import { PaygServiceService } from 'src/application/base/service/services/payg-service.service';

@Injectable()
export class PaygRobotService {
  constructor(private readonly paygServiceService: PaygServiceService) {}

  async checkVmEvents(): Promise<void> {
    return this.paygServiceService.checkAllVdcVmsEvents();
  }
}
