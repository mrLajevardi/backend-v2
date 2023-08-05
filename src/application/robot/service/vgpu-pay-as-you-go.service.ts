import { Injectable } from '@nestjs/common';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';

@Injectable()
export class VgpuPayAsYouGoService {
    constructor(
        private readonly serviceInstancesTable: ServiceInstancesTableService,
        private readonly notificationService: NotificationService,
        private readonly userTable: UserTableService,
        private readonly taskManagerService: TaskManagerService,
        private readonly servicePropertiesServicee: ServicePropertiesService,
        private readonly sessionService: SessionsService,
        private readonly transactionsTable: TransactionsTableService,
        private readonly logger: LoggerService,
        private readonly invoicesTable: InvoicesTableService,
      ) {}
      
    async function vgpuPayAsYouGoRobot() {


        /**
         * checks if user have enough credit or not if not shut down user's vms
         */
        const adminSession = await new CheckSession(app, null).checkAdminSession();
        // configs properties
        const configsData = await app.models.Configs.find({
          where: {
            PropertyKey: {
              inq: [
                'config.vgpu.orgName',
                'config.vgpu.orgId',
                'config.vgpu.vdcId',
                'QualityPlans.bronze.costPerHour',
                'QualityPlans.silver.costPerHour',
                'QualityPlans.gold.costPerHour',
              ]},
          },
        });
        // filtered configs
        const configs = {};
        configsData.forEach((property) => {
          configs[property.PropertyKey] = property.Value;
        });
        const {
          'config.vgpu.orgName': orgName,
          'config.vgpu.orgId': orgId,
          'config.vgpu.vdcId': vdcId,
          'QualityPlans.bronze.costPerHour': bronzePlan,
          'QualityPlans.gold.costPerHour': goldPlan,
          'QualityPlans.silver.costPerHour': silverPlan,
        } = configs;
        // plans
        const plans = {
          gold: goldPlan,
          bronze: bronzePlan,
          silver: silverPlan,
        };
        // list of powered_on vms
        const query = await mainWrapper.user.vdc.vcloudQuery(
            adminSession
            , {
              type: 'vm',
              filter: `(isVAppTemplate==false;vdc==${vdcId.split(':').slice(-1)});(status==POWERED_ON)`,
            },
            {
              'X-vCloud-Authorization': orgName,
              'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
              'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
            },
        );
        const {record: vms} = query.data;
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
          return id.slice(0, id.length -2 );
        });
        // Finds a list of powered-on VMs which it's last pay as you go payment date is one hour after now
        const sql = `SELECT ID, NextPAYG
         FROM [user].[ServiceInstances] 
         WHERE DATEDIFF(hh, NextPAYG, @param1) > 0 AND ID IN ${params}`;
        const expiredServices = await new Promise((resolve, reject) => {
          app.models.ServiceProperties
              .dataSource.connector.execute(sql, [new Date().toISOString(), ...gpuIds], (err, data) => {
                if (err) {
                  return reject(err);
                }
                return resolve(data);
              });
        });
        console.log(expiredServices, 'expired');
        const targetServiceIDs = expiredServices.map((service) => {
          return service.ID;
        });
        const targetServiceProperties = await app.models.ServiceProperties.find({
          where: {
            ServiceInstanceID: {
              inq: targetServiceIDs,
            },
          },
        });
        console.log(gpuIds);
        // service id and service plan
        const targetServices = [];
        for (const targetProps of targetServiceProperties) {
          if (targetProps.PropertyKey === 'plan') {
            targetServices.push({
              plan: targetProps.Value,
              ID: targetProps.ServiceInstanceID,
            });
          }
        }
        await servicePayment(targetServices, plans);
        return Promise.resolve(targetServiceProperties);
      }
      
      async function servicePayment(serviceList, plans) {
        for (const service of serviceList) {
          const serviceInstance = await app.models.ServiceInstances.findOne({
            where: {
              ID: service.ID,
            },
          });
          const user = await app.models.Users.findById(serviceInstance.UserID);
          console.log('dfdf');
          const cost = plans[service.plan];
          console.log(user.credit, '🐉');
          console.log(service.plan);
          if (user.credit < cost) {
            console.log('here');
            await taskQueue.add({
              serviceInstanceId: service.ID,
              customTaskId: null,
              requestOptions: {},
              vcloudTask: null,
              nextTask: 'turnOffVgpuVms',
              target: 'task',
              taskType: 'adminTask',
            });
          } else {
            await payAsYouGoService(service.ID, cost);
            const newDate = new Date(new Date().getTime() + 1000 * 3600).toISOString();
            await app.models.ServiceInstances.updateAll({ID: service.ID}, {
              LastPAYG: new Date().toISOString(),
              NextPAYG: newDate,
            });
          }
        }
      }
      vgpuPayAsYouGoRobot().then((d) => {
        console.log(d);
      }).catch((err) => {
        logger.error({
          message: err.message,
          stackTrace: err.stack,
          userId: null,
        });
      });

      
}
