import { Injectable } from '@nestjs/common';
import { UnavailableResource } from 'src/infrastructure/exceptions/unavailable-resource.exception';
import { SessionsService } from '../base/sessions/sessions.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty } from 'lodash';
import { PayAsYouGoService } from '../base/service/services/pay-as-you-go.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { JwtService } from '@nestjs/jwt';
import aradVgpuConfig from 'src/infrastructure/config/aradVgpuConfig';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { InvoiceItemsTableService } from '../base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePropertiesTableService } from '../base/crud/invoice-properties-table/invoice-properties-table.service';
import { TaskManagerService } from '../base/tasks/service/task-manager.service';
import { TasksTableService } from '../base/crud/tasks-table/tasks-table.service';

@Injectable()
export class VgpuService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configsTable: ConfigsTableService,
    private readonly sessionService: SessionsService,
    private readonly payAsYoGoService: PayAsYouGoService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly userTable: UserTableService,
    private readonly invoiceItemsTable: InvoiceItemsTableService,
    private readonly invoicePropertiesTable: InvoicePropertiesTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly tasksTable: TasksTableService,
  ) {}

  async getVmsInfo(session, vdcIdVgpu, orgId, orgName, filter = '') {
    if (filter !== '') {
      filter = `(isVAppTemplate==false;vdc==${vdcIdVgpu});` + `(${filter})`;
    } else {
      filter = `(isVAppTemplate==false;vdc==${vdcIdVgpu})`;
    }

    const query = await mainWrapper.user.vdc.vcloudQuery(
      session,
      {
        type: 'vm',
        filter,
      },
      {
        'X-vCloud-Authorization': orgName,
        'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
        'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
      },
    );

    const vmdataRecord = query.data.record;
    return vmdataRecord;
  }

  async chackAvalibleToPowerOnVgpu(userId) {
    const props = {};
    const VgpuConfigs = await this.configsTable.find({
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

    const availablePowerOnService = await this.configsTable.findOne({
      where: {
        PropertyKey: 'config.vgpu.availablePowerOnVgpu',
      },
    });

    if (poweredOnVm.length >= parseInt(availablePowerOnService.value)) {
      const err = new UnavailableResource();
      return Promise.reject(err);
    }
  }

  async createAvailableInternalIP(serviceId, userId, orgId, networkId) {
    const session = await this.sessionService.checkAdminSession(orgId);
    const allocatedIpAddresses =
      await mainWrapper.user.network.getIPUsageNetwrok(
        session,
        1,
        255,
        `${networkId}`,
      );
    const netwroklist = allocatedIpAddresses.values;
    let isReapted = false;
    let internalIp = '';
    for (let i = 2; i < 226; i++) {
      isReapted = false;
      for (const ip in netwroklist) {
        if (netwroklist[ip].ipAddress == '192.168.12.' + i.toString()) {
          isReapted = true;
          break;
        }
      }
      if (isReapted == false) {
        internalIp = '192.168.12.' + i.toString();
        break;
      }
    }
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceId,
      propertyKey: 'internalIP',
      value: internalIp,
    });
    return internalIp;
  }

  async getVgpuNat(session, edgeName, natName) {
    const pageSize = 225;
    const natRules = await mainWrapper.user.nat.getNatRuleList(
      session,
      pageSize,
      '',
      edgeName,
    );
    const natRulesData = natRules.data;

    const natsList = natRulesData.values.filter((value) => {
      return value.name === natName;
    });
    return natsList;
  }

  async deployVgpuVm(serviceId, userId, vdcId, orgId, orgName) {
    const vmName = serviceId + 'VM';
    const vdcIdVgpu = vdcId.split(':').slice(-1);
    const session = await this.sessionService.checkAdminSession(orgId);
    const vmInfo = await this.getVmsInfo(
      session,
      vdcIdVgpu,
      orgId,
      orgName,
      `name==${vmName}`,
    );
    if (!isEmpty(vmInfo) && vmInfo[0].isDeployed === false) {
      const vmId = vmInfo[0].href.split('/').slice(-1);
      const action = await mainWrapper.user.vm.deployVm(session, vmId);
      const servieproperties = await this.servicePropertiesTable.findOne({
        where: {
          ServiceInstanceID: serviceId,
          PropertyKey: 'plan',
        },
      });

      const gpuPlans = {
        bronze: 'gpuBronze',
        silver: 'gpuSilver',
        gold: 'gpuGold',
        platinum: 'gpuPlatinum',
      };
      const planCost = await this.itemTypesTable.find({
        where: {
          Code: { like: gpuPlans[servieproperties.value] + 'Cost%' },
          ServiceTypeID: 'vgpu',
        },
      });
      const costPerHour = planCost[0].fee;
      this.payAsYoGoService.updateLastPAYG(serviceId, costPerHour);
      return action;
    }
    return null;
  }

  async deleteVgpuNat(userId, orgId, edgeName, natName) {
    const session = await this.sessionService.checkAdminSession(orgId);
    const vgpuNat = await this.getVgpuNat(session, edgeName, natName);
    const ruleId = vgpuNat[0].id;
    const nat = await mainWrapper.user.nat.deleteNatRule(
      session,
      ruleId,
      edgeName,
    );
    // TODO add logs
    return nat;
  }

  async createVgpuVm(
    serviceId,
    userId,
    vdcId,
    orgId,
    templateId,
    templateName,
    networkId,
    networkNam,
    computerName,
    vdcComputePolicy,
  ) {
    const internalIP = await this.createAvailableInternalIP(
      serviceId,
      userId,
      orgId,
      networkId,
    );
    const session = await this.sessionService.checkAdminSession(orgId);
    const sourceHref =
      'https://vcd.aradcloud.com/api/vAppTemplate/vm-' + templateId;
    const createdVm = await mainWrapper.user.vm.instantiateVmFromTemplateAdmin(
      session,
      vdcId,
      {
        computerName,
        name: serviceId + 'VM',
        primaryNetworkIndex: 0,
        networks: [
          {
            allocationMode: 'MANUAL',
            ipAddress: internalIP,
            isConnected: true,
            networkAdaptorType: 'VMXNET3',
            networkName: networkNam,
          },
        ],
        powerOn: false,
        sourceHref: sourceHref,
        sourceId: 'urn:vcloud:vm:' + templateId,
        sourceName: templateName,
      },
      vdcComputePolicy,
    );
    return createdVm;
  }

  async createVgpuSnat(
    serviceId,
    userId,
    orgId,
    edgeName,
    externalIP,
    internalIP,
    typeNat,
  ) {
    const session = await this.sessionService.checkAdminSession(orgId);

    const config = {
      enabled: true,
      logging: false,
      priority: 0,
      firewallMatch: 'MATCH_INTERNAL_ADDRESS',
      externalAddresses: externalIP,
      internalAddresses: internalIP,
      name: serviceId + typeNat,
      snatDestinationAddresses: null,
      applicationPortProfile: null,
      type: typeNat,
      authToken: session,
    };
    const snet = await mainWrapper.user.nat.createNatRule(config, edgeName);
    return snet;
  }

  async createVgpuRunScript(
    serviceId,
    userId,
    vdcId,
    orgId,
    orgName,
    adminPassword,
    computerName,
  ) {
    const session = await this.sessionService.checkAdminSession(orgId);
    const vmName = serviceId + 'VM';
    const vdcIdVgpu = vdcId.split(':').slice(-1);
    const query = await mainWrapper.user.vdc.vcloudQuery(
      session,
      {
        type: 'vm',
        filter: `(isVAppTemplate==false;vdc==${vdcIdVgpu});(name==${vmName})`,
      },
      {
        'X-vCloud-Authorization': orgName,
        'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
        'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
      },
    );

    const vmId = query.data.record[0].href.split('/').slice(-1);

    const token = this.jwtService.sign(serviceId, {
      secret: aradVgpuConfig.JWT_SECRET_KEY,
    });
    const script = `#!/bin/sh
echo "
[Unit]
Description=RUN JUPYTER
After=multi-user.target
[Service]
WorkingDirectory=/home/vgpu
User=vgpu
Type=exec
ExecStart=jupyter lab --NotebookApp.token=${token} --ResourceUseDisplay.mem_warning_threshold=0.1 --ResourceUseDisplay.track_cpu_percent=True --ip 0.0.0.0 --allow-root --port 8888 /home/vgpu/ &> /dev/>
Restart=always
RestartSec=1
[Install]
WantedBy=multi-user.target" > /etc/systemd/system/jupyter.service
systemctl daemon-reload
systemctl restart jupyter.service
echo "
nameserver 8.8.8.8
options edns0 trust-ad
search ." > /etc/resolv.conf`;
    const createdVm = await mainWrapper.user.vm.updateGuestCustomization(
      session,
      vmId,
      {
        enabled: true,
        changeSid: false,
        joinDomainEnabled: false,
        useOrgSettings: false,
        domainName: null,
        domainUserName: null,
        domainUserPassword: null,
        machineObjectOU: null,
        adminPasswordEnabled: true,
        adminPasswordAuto: false,
        adminPassword: adminPassword,
        adminAutoLogonEnabled: false,
        adminAutoLogonCount: 0,
        resetPasswordRequired: false,
        customizationScript: script,
        computerName,
      },
    );
    return createdVm;
  }

  async createVgpuDnat(
    serviceId,
    userId,
    orgId,
    edgeName,
    externalIP,
    internalIP,
    typeNat,
    externalPort,
    portProfileName,
    portProfileId,
  ) {
    const session = await this.sessionService.checkAdminSession(orgId);
    const config = {
      enabled: true,
      logging: false,
      priority: 0,
      firewallMatch: 'BYPASS',
      externalAddresses: externalIP,
      internalAddresses: internalIP,
      dnatExternalPort: externalPort,
      name: serviceId + typeNat,
      dnatDestinationAddresses: null,
      applicationPortProfile: { name: portProfileName, id: portProfileId },
      type: typeNat,
      authToken: session,
    };
    const dnet = await mainWrapper.user.nat.createNatRule(config, edgeName);

    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceId,
      propertyKey: 'VgpuExternalPort',
      value: externalPort,
    });
    return dnet;
  }

  async createVgpu(userId, invoiceID, serviceInstanceId, options) {
    await this.chackAvalibleToPowerOnVgpu(userId);
    // check minimum cost at Credit
    const minimumCost = await this.configsTable.findOne({
      where: {
        PropertyKey: 'config.vgpu.minimumCost',
      },
    });
    const user = await this.userTable.findById(userId);
    if (parseInt(minimumCost.value) > user.credit) {
      const err = new NotEnoughCreditException();
      return Promise.reject(err);
    }
    const gpuPlans = {
      gpuBronze: 'bronze',
      gpuSilver: 'silver',
      gpuGold: 'gold',
      gpuPlatinum: 'platinum',
    };
    const invoiceItems = await this.invoiceItemsTable.find({
      where: {
        invoiceID: invoiceID,
        ItemID: { neq: 38 },
      },
    });
    const item = await this.itemTypesTable.findById(invoiceItems[0].item.id);
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'plan',
      value: gpuPlans[item.code],
    });

    const pcProp = await this.invoicePropertiesTable.find({
      where: {
        InvoiceID: invoiceID,
      },
    });
    const props = {};
    for (const prop of pcProp) {
      props[prop.propertyKey] = prop.value;
    }
    for (const item of Object.keys(props)) {
      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: item,
        value: props[item],
      });
    }
    const task = await this.tasksTable.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      operation: 'createVgpuVm',
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
    });
    await this.taskManagerService.addTask({
      serviceInstanceId: serviceInstanceId,
      customTaskId: task['TaskID'],
      vcloudTask: null,
      nextTask: 'createVgpuVm',
      requestOptions: options,
      target: 'object',
    });
    return task['TaskID'];
  }
}
