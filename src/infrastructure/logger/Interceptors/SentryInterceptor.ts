import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';
import { Severity } from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const start = Date.now();

    return next.handle().pipe(
      tap(
        (data) => {
          const duration = Date.now() - start;
          Sentry.captureEvent({
            message: 'http logs',
            level: Severity.Info,
            timestamp: Date.now() / 1000,
            request: {
              method: request.method,
              url: request.url,
              env: {
                ip: request.ip,
                statusMessage: request.statusMessage,
                statusCode: request.statusCode,
              },
              data: request.body,
            },
            start_timestamp: Number(start / 1000),
            contexts: {
              method: request.method,
              url: request.url,
              statusCode: request.statusCode,
              statusMessage: request.statusMessage,
              ip: request.ip,
            },
            user: {
              id: request.user?.userId,
              username: request.user?.username,
              guid: request.user?.guid,
            },
            extra: {
              duration: duration,
              response: data,
            },
          });
        },
        (exception) => {
          Sentry.configureScope((scope) => {
            scope.setTag('method', request.method);
            scope.setTag('url', request.url);
            scope.setUser({
              ip_address: request.ip,
              id: request.user?.userId,
              username: request.user?.username,
              guid: request.user?.guid,
            });
          });

          Sentry.captureException(exception, {
            extra: {
              body: request.body,
            },
          });
        },
      ),
    );
  }
}
