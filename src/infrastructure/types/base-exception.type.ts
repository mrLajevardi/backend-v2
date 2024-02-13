import { BaseException } from '../exceptions/base/base-exception';

export type BaseExceptionType = new (name: string) => BaseException;
