import { Injectable } from '@nestjs/common';
import { ErrorLogTableService } from 'src/application/base/crud/error-log-table/error-log-table.service';
import * as fs from 'fs';
import { InfoLogTableService } from 'src/application/base/crud/info-log-table/info-log-table.service';
import { DebugLogTableService } from 'src/application/base/crud/debug-log-table/debug-log-table.service';
import { isEmpty } from 'lodash';

@Injectable()
export class LoggerService {
  constructor(
    private readonly errorLogTable: ErrorLogTableService,
    private readonly infoLogTable: InfoLogTableService,
    private readonly debugLogTable: DebugLogTableService,
  ) {}

  async error(info) {
    await this.errorLogTable.create({
      userId: info?.userId,
      stackTrace: info?.stackTrace,
      message: info?.message,
      request: info?.request,
      timeStamp: new Date(),
    });
  }

  async info(type, action, options, requestOptions) {
    const path = 'src/infrastructure/logger/loggerObjects.json';
    const jsonData = fs.readFileSync(path, 'utf8');
    const loggerObjects = JSON.parse(jsonData);

    const typeInfo = loggerObjects[type];
    const actionInfo = typeInfo.actions[action];
    const description = this.replacer(actionInfo.description, options);
    let userId = requestOptions.userId;
    if (requestOptions.adminId) {
      userId = requestOptions.adminId;
    }
    await this.infoLogTable.create({
      userId: requestOptions.userId || null,
      actionId: actionInfo.actionId || null,
      typeId: typeInfo.typeId || null,
      description: description || null,
      timeStamp: new Date(),
      ip: requestOptions.ip || null,
      serviceInstanceId: requestOptions.serviceInstanceId || null,
      object: actionInfo.object || options._object,
    });
  }

  async debug(req, res, err = null) {
    const url = req.url;
    const date = new Date().toISOString();
    let status = res.statusCode;
    let body = res.locals.body;
    if (err) {
      status = err.statusCode;
      if (isEmpty(status)) {
        status = 500;
      }
      body = err;
      console.log(body);
    }
    const requestBody = req.body;
    let userId = null;
    if (req?.accessToken?.userId) {
      userId = req?.accessToken.userId || null;
    }
    await this.debugLogTable
      .create({
        userId: userId,
        timeStamp: new Date(date),
        url: url,
        statusCode: status,
        request: JSON.stringify(requestBody),
        response: JSON.stringify(body),
        method: req.method,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      })
      .then((log) => {
        console.log(log);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  replacer(template, obj) {
    const keys = Object.keys(obj);
    const func = Function(...keys, 'return `' + template + '`;');
    return func(...keys.map((k) => obj[k]));
  }
}
