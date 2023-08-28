import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Severity } from '@sentry/node';

@Injectable()
export class AppService {
  // constructor(@InjectSentry() private readonly client: SentryService) {
  //   console.log('😎');
  //   client.log('AppSevice Loaded','test', true); // creates log asBreadcrumb //
  //   client.instance().addBreadcrumb({level: Severity.Error , message: 'How to use native breadcrumb', data: { context: 'WhatEver'}})
  //   client.error('AppService Debug', 'context');
  // }
  getHello(): string {
    return 'Hello World!';
  }
}
