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
import { LogErrorDto } from 'src/infrastructure/dto/log-error.dto';

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
      const date = new Date(
        new Date().getTime() + warningsProp.daysAfterNow * 24 * 60 * 60 * 1000,
      );
      let data: any[] = await this.serviceInstancesTable.enabledServices([
        date,
        'vdc',
      ]);
      if (warningsProp.daysAfterNow === -13) {
        data = await this.serviceInstancesTable.disabledServices([date, 'vdc']);
        console.log('tes', { data, date });
      }
      for (const service of data) {
        if (service.WarningSent < warningsProp.index) {
          await this.serviceInstancesTable.updateAll(
            {
              id: service.ID,
            },
            {
              warningSent: parseInt(service.WarningSent) + 1,
            },
          );
          const user: User = await this.userTable.findById(service.userId);
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
        console.log('hello');
        const data: any = await this.serviceInstancesTable.disabledServices([
          date,
          'vdc',
        ]);
        for (const service of data) {
          // console.log(service);
          await this.taskManagerService.addTask({
            serviceInstanceId: service.ID,
            customTaskId: null,
            requestOptions: {},
            vcloudTask: null,
            nextTask: 'deleteVdc',
            target: 'object',
          });
        }
      } else if (warningsProp.code === 'disableService') {
        console.log('first');
        const data: any =
          await this.serviceInstancesTable.enabledServiceExtended([
            date,
            'vdc',
          ]);
        // console.log({ data, date });
        for (const service of data) {
          const props =
            await this.servicePropertiesServicee.getAllServiceProperties(
              service.ID,
            );
          const session = await this.sessionService.checkAdminSession();
          await mainWrapper.admin.vdc.disableVdc(session, props['vdcId']);
          await this.taskManagerService.addTask({
            serviceInstanceId: service.ID,
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
