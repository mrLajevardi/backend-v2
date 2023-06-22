import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigsService } from '../base/service/configs/configs.service';
import { ServiceChecksService } from '../base/service/service-instances/service/service-checks/service-checks.service';
import { UnavailableResource } from 'src/infrastructure/exceptions/unavailable-resource.exception';
import { SessionsService } from '../base/sessions/sessions.service';

@Injectable()
export class VgpuService {
  constructor(
    private readonly configsService: ConfigsService,
    private readonly sessionService: SessionsService,
  ) {}

  async getVmsInfo(session, vdcIdVgpu, orgId, orgName, filter = '') {
    if (filter !== '') {
      filter = `(isVAppTemplate==false;vdc==${vdcIdVgpu});` + `(${filter})`;
    } else {
      filter = `(isVAppTemplate==false;vdc==${vdcIdVgpu})`;
    }

    throw new InternalServerErrorException('Not Implemented');
    let query;
    // query = await mainWrapper.user.vdc.vcloudQuery(session, {
    //   type: 'vm',
    //   filter,
    // },
    // {
    //   'X-vCloud-Authorization': orgName,
    //   'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
    //   'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
    // },
    // );

    const vmdataRecord = query.data.record;
    return vmdataRecord;
  }

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
    const session = await this.sessionService.checkAdminSession(userId);
    const vmInfo = await this.getVmsInfo(
      session,
      vdcIdVgpu,
      props['orgId'],
      props['orgName'],
    );
    const poweredOnVm = await vmInfo.filter((value) => {
      return value.status === 'POWERED_ON';
    });

    const availablePowerOnService = await this.configsService.findOne({
      where: {
        PropertyKey: 'config.vgpu.availablePowerOnVgpu',
      },
    });

    if (poweredOnVm.length >= parseInt(availablePowerOnService.value)) {
      const err = new UnavailableResource();
      return Promise.reject(err);
    }
  }
}
