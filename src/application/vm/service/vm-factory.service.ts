import { Injectable } from '@nestjs/common';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { GetVMQueryDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/get-vm-query.dto';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VmStatusEnum } from '../enums/vm-status.enum';
import { VmList, VmListValue } from '../dto/get-vm-list.dto';

@Injectable()
export class VmFactoryService {
  constructor(
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly vdcWrapperService: VdcWrapperService,
  ) {}

  async getVmList(
    serviceInstanceId: string,
    userId: number,
    filter = '',
  ): Promise<VmList> {
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );
    if (props.vdcId == null)
      return { values: [], page: 0, pageSize: 0, pageCount: 0, total: 0 };
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props.orgId),
    );
    const vmList = await this.vdcWrapperService.vcloudQuery<GetVMQueryDto>(
      session,
      {
        type: 'vm',
        filter,
      },
    );
    if (filter !== '') {
      filter = `(isVAppTemplate==false;vdc==${props.vdcId});` + `(${filter})`;
    } else {
      filter = `(isVAppTemplate==false;vdc==${props.vdcId})`;
    }
    const vmValues: VmListValue[] = [];
    for (const recordItem of vmList.data.record) {
      const id = recordItem.href.split('vApp/')[1];
      const name = recordItem.name;
      const vmToolsVersion = recordItem.otherAttributes?.vmToolsVersion;
      const os = recordItem.guestOs;
      const description = recordItem.description;
      const cpu = recordItem.numberOfCpus;
      const storage = recordItem.totalStorageAllocatedMb - recordItem.memoryMB;
      const memory = recordItem.memoryMB;
      const status = VmStatusEnum[recordItem.status];
      const containerId = recordItem.container.split('vApp/')[1];
      vmValues.push({
        id,
        name,
        os,
        cpu,
        storage,
        memory,
        vmToolsVersion,
        description,
        status,
        containerId,
        snapshot: recordItem.snapshot,
      });
    }
    const data = {
      total: vmList.data.total,
      pageSize: vmList.data.pageSize,
      page: vmList.data.page,
      pageCount: Math.floor(vmList.data.total / vmList.data.pageSize) + 1,
      values: vmValues,
    };
    return Promise.resolve(data);
  }
}
