import { Injectable } from '@nestjs/common';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import * as fs from 'fs';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { User } from 'src/infrastructure/database/entities/User';
import { ServiceStatusEnum } from 'src/application/base/service/enum/service-status.enum';
import { ServiceTypesEnum } from 'src/application/base/service/enum/service-types.enum';
import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';
import { LessThanOrEqual, Not } from 'typeorm';

@Injectable()
export class CheckServiceService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly notificationService: NotificationService,
    private readonly userTable: UserTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly servicePropertiesServicee: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly logger: LoggerService,
  ) {}

  private getWarningsSettings() {
    const data: string = fs.readFileSync(
      './dist/application/robot/config/warnings-settings.json',
      'utf8',
    );
    const warningsSettings: any = JSON.parse(data);
    return warningsSettings;
  }

  async sendEmailToExpiredServices() {
    const warningsSettings: any = this.getWarningsSettings();
    for (const warningsProp of warningsSettings.props) {
      const data = await this.serviceInstancesTable.find({
        where: {
          isDeleted: false,
          servicePlanType: ServicePlanTypeEnum.Static,
          serviceTypeId: ServiceTypesEnum.Vdc,
          daysLeft: warningsProp.daysAfterNow,
        },
      });
      for (const service of data) {
        if (service.warningSent < warningsProp.index) {
          await this.serviceInstancesTable.updateAll(
            {
              id: service.id,
            },
            {
              warningSent: service.warningSent + 1,
            },
          );
          const user = await this.userTable.findById(service.userId);
          if (!user.email) {
            return;
          }
          const options =
            this.notificationService.emailContents.serviceExpirationWarning(
              warningsProp.message,
              user.email,
              warningsProp.subject,
            );
          await this.notificationService.email.sendMail(options);
        }
      }
    }
  }

  /**
   * disable or delete
   */
  async disableAndDeleteService() {
    const warningsSettings: any = this.getWarningsSettings();
    for (const warningsProp of warningsSettings.props) {
      const date = new Date(
        new Date().getTime() + warningsProp.daysAfterNow * 24 * 60 * 60 * 1000,
      );
      if (warningsProp.code === 'deleteService') {
        const data = await this.serviceInstancesTable.find({
          where: {
            daysLeft: LessThanOrEqual(warningsProp.daysAfterNow),
            isDeleted: false,
            isDisabled: true,
            servicePlanType: ServicePlanTypeEnum.Static,
            serviceTypeId: ServiceTypesEnum.Vdc,
          },
        });
        for (const service of data) {
          // console.log(service);
          await this.taskManagerService.addTask({
            serviceInstanceId: service.id,
            customTaskId: null,
            requestOptions: {},
            vcloudTask: null,
            nextTask: 'deleteVdc',
            target: 'object',
          });
        }
      } else if (warningsProp.code === 'beforeDelete') {
        const data = await this.serviceInstancesTable.find({
          where: {
            daysLeft: LessThanOrEqual(warningsProp.daysAfterNow),
            isDeleted: false,
            isDisabled: true,
            servicePlanType: ServicePlanTypeEnum.Static,
            serviceTypeId: ServiceTypesEnum.Vdc,
          },
        });
        for (const service of data) {
          // console.log(service);
          await this.serviceInstancesTable.update(service.id, {
            status: ServiceStatusEnum.Deleted,
          });
        }
      } else if (warningsProp.code === 'disableService') {
        console.log('first');
        const data = await this.serviceInstancesTable.find({
          where: {
            daysLeft: LessThanOrEqual(warningsProp.daysAfterNow),
            isDeleted: false,
            isDisabled: false,
            servicePlanType: ServicePlanTypeEnum.Static,
            serviceTypeId: ServiceTypesEnum.Vdc,
          },
        });
        // console.log({ data, date });
        for (const service of data) {
          const props =
            await this.servicePropertiesServicee.getAllServiceProperties(
              service.id,
            );
          await this.serviceInstancesTable.update(service.id, {
            status: ServiceStatusEnum.Expired,
            isDisabled: true,
          });
          const session = await this.sessionService.checkAdminSession();
          await mainWrapper.admin.vdc.disableVdc(session, props['vdcId']);
          await this.taskManagerService.addTask({
            serviceInstanceId: service.id,
            customTaskId: null,
            requestOptions: {},
            vcloudTask: null,
            nextTask: 'disableVms',
            target: 'object',
          });
        }
      }
    }
  }

  public async sendEmailToExpiresServices() {
    this.sendEmailToExpiredServices()
      .then(() => {
        // process.exit();
      })
      .catch((err) => {
        console.log(err);
        this.logger.error({
          message: err.message,
          stackTrace: err.stack,
          userId: null,
        });
        // process.exit();
      });
    this.disableAndDeleteService()
      .then((first) => {
        // process.exit();
      })
      .catch((err) => {
        this.logger.error({
          message: err.message,
          stackTrace: err.stack,
          userId: null,
        });
        // process.exit();
      });
  }
}
