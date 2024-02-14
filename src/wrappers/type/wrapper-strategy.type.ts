import { WrappersEnum } from '../enum/wrappers.enum';
import { WrapperBuilderInterface } from '../interfaces/wrapper-builder.interface';

export type WrapperStrategyType = {
  [key in WrappersEnum]: WrapperBuilderInterface;
};
