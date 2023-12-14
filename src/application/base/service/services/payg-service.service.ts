import { Injectable } from '@nestjs/common';
import { VmWrapperService } from 'src/wrappers/main-wrapper/service/user/vm/vm-wrapper.service';
import { SessionsService } from '../../sessions/sessions.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { GetVMQueryDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/get-vm-query.dto';
import { ServicePropertiesService } from '../../service-properties/service-properties.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { GetVdcIdBy } from 'src/application/vdc/utils/vdc-properties.utils';
import { VmPowerStateEventEnum } from 'src/wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';
import { PaygCostCalculationService } from '../../invoice/service/payg-cost-calculation.service';
import { InvoiceItemCost } from '../../invoice/interface/invoice-item-cost.interface';
import { cloneDeep } from 'lodash';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { NatWrapperService } from 'src/wrappers/main-wrapper/service/user/nat/nat-wrapper.service';

@Injectable()
export class PaygServiceService {
  constructor(
    private readonly vmWrapperService: VmWrapperService,
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly organizationTableService: OrganizationTableService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly natWrapperService: NatWrapperService,
  ) {}

  async checkAllVdcVmsEvents(): Promise<void> {
    const adminSession = await this.sessionService.checkAdminSession();
    const activeServices = await this.serviceInstanceTableService.find({
      where: {
        status: ServiceStatusEnum.Success,
        userId: 1043,
        isDeleted: false,
      },
    });
    for (const service of activeServices) {
      const props =
        await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
          service.id,
        );
      const org = await this.organizationTableService.findById(
        Number(props.orgId),
      );
      const tenantHeaders = {
        'X-Vmware-Vcloud-Tenant-Context': org.orgId,
        'X-Vmware-Vcloud-Auth-Context': org.name,
      };
      const vmslist = await this.vdcWrapperService.vcloudQuery<GetVMQueryDto>(
        adminSession,
        {
          type: 'vm',
          page: 1,
          pageSize: 128,
          filter: `(isVAppTemplate==false;vdc==${GetVdcIdBy(props.vdcId)})`,
        },
        tenantHeaders,
      );
      const totalVpcCost: InvoiceItemCost[][] = [];
      for (const vm of vmslist.data.record) {
        const containerId = vm.container.split('/').slice(-1)[0];
        const id = vm.href.split('/').slice(-1)[0];
        const sortAsc = 'timestamp';
        const urnVmId = 'urn:vcloud:vm:' + id.replace('vm-', '');
        const urnContainerId =
          'urn:vcloud:vapp:' + containerId.replace('vapp-', '');
        const offset = new Date('2023-12-13T11:51:19.012Z').toISOString();
        let lastState: VmPowerStateEventEnum = 0;
        const eventType = 'com/vmware/vcloud/event/vm/change_state';
        const filter = `(timestamp=gt=${offset};(eventEntity.id==${urnVmId},eventEntity.id==${urnContainerId});eventType==${eventType})`;
        const events = await this.vmWrapperService.eventVm(
          adminSession,
          filter,
          1,
          128,
          tenantHeaders,
          sortAsc,
        );
        let startDate = new Date(offset);
        let endDate: Date;
        let checkCompleted = false;
        for (const event of events.data.values) {
          const vmState = event.additionalProperties['vm.state'];
          if (checkCompleted) {
            continue;
          }
          if (
            lastState === VmPowerStateEventEnum.PowerOff &&
            vmState !== VmPowerStateEventEnum.PowerOff
          ) {
            lastState = vmState;
            startDate = new Date(event.timestamp);
            continue;
          } else if (lastState === VmPowerStateEventEnum.PowerOn) {
            if (vmState !== VmPowerStateEventEnum.PowerOn) {
              endDate = new Date(event.timestamp);
              lastState = vmState;
            } else {
              endDate = new Date();
              checkCompleted = true;
            }
            const computeItems =
              await this.paygCostCalculationService.calculateVdcPaygVm(
                service,
                startDate,
                endDate,
                vm.numberOfCpus,
                vm.memoryMB,
              );
            totalVpcCost.push(computeItems);
            startDate = endDate;
          }
        }
      }
      const sum = this.sumComputeItems(totalVpcCost);
      const totalCost =
        await this.paygCostCalculationService.calculateVdcPaygService(
          sum,
          service,
        );
      await this.disablePaygService(
        props,
        tenantHeaders,
        adminSession,
        vmslist.data,
      );
    }
  }

  sumComputeItems(invoiceItemsCost: InvoiceItemCost[][]): InvoiceItemCost[] {
    const sum = cloneDeep(invoiceItemsCost[0]);
    sum[0] = { ...sum[0], cost: 0, value: '0' };
    sum[1] = { ...sum[1], cost: 0, value: '0' };
    for (const invoiceItemCost of invoiceItemsCost) {
      sum[0].value = String(
        Number(sum[0].value) + Number(invoiceItemCost[0].value),
      );
      sum[1].value = String(
        Number(sum[1].value) + Number(invoiceItemCost[1].value),
      );
      sum[0].cost = sum[0].cost + invoiceItemCost[0].cost;
      sum[1].cost = sum[1].cost + invoiceItemCost[1].cost;
    }
    return sum;
  }

  async disablePaygService(
    props: VdcProperties,
    tenantHeaders: object,
    session: string,
    vmList: GetVMQueryDto,
  ): Promise<void> {
    const vmRequests: Promise<VcloudTask>[] = [];
    const natRequests: Promise<VcloudTask>[] = [];
    const action = 'suspend';
    vmList.record.forEach((item) => {
      const vmId = item.href.split('/').slice(-1)[0];
      const promise = this.vmWrapperService.undeployvApp(
        session,
        vmId,
        action,
        tenantHeaders,
      );
      vmRequests.push(promise);
    });
    const nat = await this.natWrapperService.getNatRuleList(
      session,
      1,
      '',
      props.edgeName,
      tenantHeaders,
    );
    nat.data.values.forEach((item) => {
      const request = this.natWrapperService.updateNatRule(
        {
          applicationPortProfile: item.applicationPortProfile,
          authToken: session,
          description: item.description,
          dnatExternalPort: item.dnatExternalPort,
          enabled: false,
          externalAddresses: item.externalAddresses,
          firewallMatch: item.firewallMatch,
          internalAddresses: item.internalAddresses,
          internalPort: null,
          logging: item.logging,
          name: item.name,
          priority: item.priority,
          ruleId: item.id,
          snatDestinationAddresses: item.snatDestinationAddresses,
          type: item.type,
        },
        props.edgeName,
      );
      natRequests.push(request);
    });
    try {
      await Promise.allSettled(vmRequests);
    } catch (err) {
      console.log(err);
    }
    try {
      await Promise.allSettled(natRequests);
    } catch (err) {
      console.log(err);
    }
  }
}
