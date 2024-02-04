import { Method, RawAxiosRequestHeaders } from 'axios';
import { WrapperBuilderInterface } from '../interfaces/wrapper-builder.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WrapperResourceInterface } from '../interfaces/wrapper-resource.interface';

@Injectable()
export class WrapperStrategy implements WrapperBuilderInterface {
  private strategy: WrapperBuilderInterface;

  get resource(): typeof this.strategy.resource {
    throw new InternalServerErrorException();
  }

  setStrategy(strategy: WrapperBuilderInterface): void {
    this.strategy = strategy;
  }

  build(): WrapperResourceInterface<unknown, unknown, unknown, unknown> {
    this.strategy.setDefault();
    return this.strategy.build();
  }

  setAdditionalConfigs<T>(
    configs: T,
  ): WrapperBuilderInterface<unknown, unknown, unknown, T> {
    this.strategy.setAdditionalConfigs(configs);
    return this as WrapperBuilderInterface<unknown, unknown, unknown, T>;
  }

  setBaseUrl(baseUrl: string): this {
    this.strategy.setBaseUrl(baseUrl);
    return this;
  }
  setMethod(method: Method): this {
    this.strategy.setMethod(method);
    return this;
  }
  setBody<T>(body: T): WrapperBuilderInterface<T, unknown, unknown, unknown> {
    this.strategy.setBody<T>(body);
    return this as WrapperBuilderInterface<T, unknown, unknown, unknown>;
  }
  setHeaders<T extends RawAxiosRequestHeaders>(
    headers: T,
  ): WrapperBuilderInterface<unknown, unknown, T, unknown> {
    this.strategy.setHeaders(headers);
    return this as WrapperBuilderInterface<unknown, unknown, T, unknown>;
  }
  setParams<T>(
    params: T,
  ): WrapperBuilderInterface<unknown, T, unknown, unknown> {
    this.strategy.setParams(params);
    return this as WrapperBuilderInterface<unknown, T, unknown, unknown>;
  }
  setUrl(url: string): this {
    this.strategy.setUrl(url);
    return this;
  }
  setDefault(): this {
    this.strategy.setDefault();
    return this;
  }

  setException(exception: (error: Error) => Promise<Error>): this {
    this.strategy.setException(exception);
    return this;
  }
}
