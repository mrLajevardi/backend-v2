import { Injectable } from '@nestjs/common';
import { ConfigsService } from '../base/configs/configs.service';
import { ServiceChecksService } from '../base/service-instances/service-checks.service';

@Injectable()
export class VgpuService {
  constructor(
    private readonly configsService: ConfigsService,
    private readonly serviceChecksSvc: ServiceChecksService,
  ) {}

  async chackAvalibleToPowerOnVgpu(userId) {
    const props = {};
    const VgpuConfigs = await this.configsService.find({
      where: {
        PropertyKey: { like: '%config.vgpu.%' },
      },
    });
    for (const prop of VgpuConfigs) {
      const key = prop.propertyKey.split('.').slice(-1)[0];
      const item = prop.value;
      props[key] = item;
    }
    const vdcIdVgpu = props['vdcId'].split(':').slice(-1);
    const session = await new CheckSession(app, userId).checkAdminSession(
      props.orgId,
    );
    const vmInfo = await getVmsInfo(
      session,
      vdcIdVgpu,
      props.orgId,
      props.orgName,
    );
    const poweredOnVm = await vmInfo.filter((value) => {
      return value.status === 'POWERED_ON';
    });

    const availablePowerOnService = await app.models.Configs.findOne({
      where: {
        PropertyKey: 'config.vgpu.availablePowerOnVgpu',
      },
    });

    if (poweredOnVm.length >= parseInt(availablePowerOnService.Value)) {
      const err = new HttpExceptions().unavailableResource();
      return Promise.reject(err);
    }
  }
}
