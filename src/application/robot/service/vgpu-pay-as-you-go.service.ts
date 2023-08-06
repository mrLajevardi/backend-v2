import { Injectable } from '@nestjs/common';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { PayAsYouGoService } from 'src/application/base/pay-as-you-go/pay-as-you-go.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { In } from 'typeorm';

@Injectable()
export class VgpuPayAsYouGoService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly userTable: UserTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly configsTable: ConfigsTableService,
    private readonly paygService: PayAsYouGoService,
  ) {}

  async vgpuPayAsYouGoRobot() {
    /**
     * checks if user have enough credit or not if not shut down user's vms
     */
    const adminSession = await this.sessionService.checkAdminSession(null);
    // configs properties
    const configsData = await this.configsTable.getVgpuRobotConfigData();
    // filtered configs
    const configs = {};
    configsData.forEach((property) => {
      configs[property.propertyKey] = property.value;
    });

    const orgName = configs['config.vgpu.orgName'];
    const orgId = configs['config.vgpu.orgId'];
    const vdcId = configs['config.vgpu.vdcId'];
    const bronzePlan = configs['QualityPlans.bronze.costPerHour'];
    const goldPlan = configs['QualityPlans.gold.costPerHour'];
    const silverPlan = configs['QualityPlans.silver.costPerHour'];

    // plans
    const plans = {
      gold: goldPlan,
      bronze: bronzePlan,
      silver: silverPlan,
    };
    // list of powered_on vms
    const query = await mainWrapper.user.vdc.vcloudQuery(
      adminSession,
      {
        type: 'vm',
        filter: `(isVAppTemplate==false;vdc==${vdcId
          .split(':')
          .slice(-1)});(status==POWERED_ON)`,
      },
      {
        'X-vCloud-Authorization': orgName,
        'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
        'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
      },
    );
    const { record: vms } = query.data;
    // serviceIds of vms
    let gpuIds = vms.map((vm) => {
      return vm.name;
    });
    // params of sql query in statement
    let params = '(';
    gpuIds.forEach((id, index) => {
      params += `@param${index + 2}`;
      if (index < gpuIds.length - 1) {
        params += ',';
      }
    });
    params += ')';
    gpuIds = gpuIds.map((id) => {
      return id.slice(0, id.length - 2);
    });
    // Finds a list of powered-on VMs which it's last pay as you go payment date is one hour after now
    const sql = `SELECT ID, NextPAYG
         FROM [user].[ServiceInstances] 
         WHERE DATEDIFF(hh, NextPAYG, @param1) > 0 AND ID IN ${params}`;

    const expiredServicesQuery = this.serviceInstancesTable
      .getQueryBuilder()
      .select(['serviceInstances.ID', 'serviceInstances.NextPAYG'])
      .where('DATEDIFF(hour, serviceInstances.NextPAYG, :param1) > 0', {
        param1: Date(),
      })
      .andWhere('serviceInstances.ID IN (:...params)', { params: gpuIds });
    const expiredServices = await expiredServicesQuery.getMany();

    console.log(expiredServices, 'expired');
    const targetServiceIDs = expiredServices.map((service) => {
      return service.id;
    });
    const targetServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId: In(targetServiceIDs),
      },
    });
    console.log(gpuIds);
    // service id and service plan
    const targetServices = [];
    for (const targetProps of targetServiceProperties) {
      if (targetProps.propertyKey === 'plan') {
        targetServices.push({
          plan: targetProps.value,
          ID: targetProps.serviceInstanceId,
        });
      }
    }
    await this.servicePayment(targetServices, plans);
    return Promise.resolve(targetServiceProperties);
  }

  async servicePayment(serviceList, plans) {
    for (const service of serviceList) {
      const serviceInstance = await this.serviceInstancesTable.findOne({
        where: {
          id: service.id,
        },
      });
      const user = await this.userTable.findById(serviceInstance.userId);
      console.log('dfdf');
      const cost = plans[service.plan];
      console.log(user.credit, '🐉');
      console.log(service.plan);
      if (user.credit < cost) {
        console.log('here');
        await this.taskManagerService.addTask({
          serviceInstanceId: service.id,
          customTaskId: null,
          requestOptions: {},
          vcloudTask: null,
          nextTask: 'turnOffVgpuVms',
          target: 'task',
          taskType: 'adminTask',
        });
      } else {
        await this.paygService.payAsYouGoService(service.id, cost);
        const newDate = new Date(new Date().getTime() + 1000 * 3600);
        await this.serviceInstancesTable.updateAll(
          { id: service.id },
          {
            lastPayg: new Date(),
            nextPayg: newDate,
          },
        );
      }
    }
  }
}
