import { Injectable } from "@nestjs/common";
import { ServiceInstancesTableService } from "src/application/base/crud/service-instances-table/service-instances-table.service";
import fs from "fs";
import { NotificationService } from "src/application/base/notification/notification.service";
import { UserTableService } from "src/application/base/crud/user-table/user-table.service";
import { TaskManagerService } from "src/application/base/tasks/service/task-manager.service";
import { ServicePropertiesService } from "src/application/base/service-properties/service-properties.service";
import { SessionsService } from "src/application/base/sessions/sessions.service";
import { mainWrapper } from "src/wrappers/mainWrapper/mainWrapper";
import { LoggerService } from "src/infrastructure/logger/logger.service";

@Injectable()
export class CheckServiceService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly notificationService: NotificationService,
    private readonly userTable: UserTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly servicePropertiesServicee: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly logger: LoggerService
  ) {}

  serviceInstanceExe(sql, params){
      return new Promise((resolve, reject) => {
        app.models.ServiceInstances.dataSource.connector
            .execute(sql, params, (err, data) => {
              if (err) {
                reject(err);
              }
              resolve(data);
            });
      });
    };

  private getWarningsSettings() {
    const data = fs.readFileSync("./testJsonFile.json", "utf8");
    const warningsSettings = JSON.parse(data);
    return warningsSettings;
  }

  async sendEmailToExpiredServices() {
    const warningsSettings = this.getWarningsSettings();
    for (const warningsProp of warningsSettings.props) {
      const date = new Date(
        new Date().getTime() + warningsProp.daysAfterNow * 24 * 60 * 60 * 1000
      );
      let data = await serviceInstanceExe(enabledServiceSql, [date, "vdc"]);
      if (warningsProp.daysAfterNow === -13) {
        data = await serviceInstanceExe(disabledServiceSql, [date, "vdc"]);
        console.log("tes", { data, date });
      }
      for (const service of data) {
        if (service.WarningSent < warningsProp.index) {
          await this.serviceInstancesTable.updateAll(
            {
              id: service.ID,
            },
            {
              warningSent: parseInt(service.WarningSent) + 1,
            }
          );
          const user = await this.userTable.findById(service.UserID);
          const options =
            this.notificationService.emailContents.serviceExpirationWarning(
              warningsProp.message,
              user.email,
              warningsProp.subject
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
    const warningsSettings = this.getWarningsSettings();
    for (const warningsProp of warningsSettings.props) {
      const date = new Date(
        new Date().getTime() + warningsProp.daysAfterNow * 24 * 60 * 60 * 1000
      );
      if (warningsProp.code === "deleteService") {
        console.log("hello");
        const data = await serviceInstanceExe(disabledServiceSql, [
          date,
          "vdc",
        ]);
        for (const service of data) {
          console.log(service);
          await this.taskManagerService.addTask({
            serviceInstanceId: service.ID,
            customTaskId: null,
            requestOptions: {},
            vcloudTask: null,
            nextTask: "deleteVdc",
            target: "object",
          });
        }
      } else if (warningsProp.code === "disableService") {
        console.log("first");
        const data = await serviceInstanceExe(enabledServiceExtendedSql, [
          date,
          "vdc",
        ]);
        console.log({ data, date });
        for (const service of data) {
          const props =
            await this.servicePropertiesServicee.getAllServiceProperties(
              service.ID,
              app
            );
          const session = await this.sessionService.checkAdminSession(
            service.userId
          );
          await mainWrapper.admin.vdc.disableVdc(session, props["vdcId"]);
          await this.taskManagerService.addTask({
            serviceInstanceId: service.ID,
            customTaskId: null,
            requestOptions: {},
            vcloudTask: null,
            nextTask: "disableVms",
            target: "object",
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
