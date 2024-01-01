import { Injectable } from '@nestjs/common';
import { TasksConfig } from '../../interface/tasks-configs.interface';
import { TasksEnum } from '../../enum/tasks.enum';
import { UpgradeVdcStepsEnum } from './enum/upgrade-vdc-steps.enum';
import { UpgradeVdcComputeResourcesService } from './upgrade-compute-resources.service';
import { UpgradeDiskResourcesService } from './upgrade-disk-resource.service';
import { IncreaseNumberOfIpsService } from './increase-number-of-ips.service';

@Injectable()
export class UpgradeVdcService {
  taskName: TasksEnum;
  steps: object[];
  constructor(
    private readonly upgradeComputeResourceTask: UpgradeVdcComputeResourcesService,
    private readonly upgradeDiskResourcesService: UpgradeDiskResourcesService,
    private readonly increaseNumberOfIpsService: IncreaseNumberOfIpsService,
  ) {
    this.taskName = TasksEnum.UpgradeVdc;
    this.steps = [
      this.upgradeComputeResourceTask,
      this.upgradeDiskResourcesService,
      this.increaseNumberOfIpsService,
    ];
  }
}
