import { Injectable } from '@nestjs/common';
import { TasksConfig } from '../../interface/tasks-configs.interface';
import { TasksEnum } from '../../enum/tasks.enum';
import { UpgradeVdcStepsEnum } from './enum/upgrade-vdc-steps.enum';

@Injectable()
export class UpgradeVdcService implements TasksConfig<UpgradeVdcStepsEnum> {
  taskName: TasksEnum;
  steps: UpgradeVdcStepsEnum[];
  constructor() {
    this.taskName = TasksEnum.UpgradeVdc;
    this.steps = [
      UpgradeVdcStepsEnum.IncreaseNumberOfIps,
      UpgradeVdcStepsEnum.UpgradeComputeResources,
      UpgradeVdcStepsEnum.UpgradeDiskResources,
    ];
  }
}
