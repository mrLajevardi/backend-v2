import { Inject } from '@nestjs/common';
import { WrapperBuilderInterface } from './interfaces/wrapper-builder.interface';
import { ZAMMAD_WRAPPER_SERVICE } from './zammad-wrapper/const/zammad-wrapper.const';
import { WrapperStrategyType } from './type/wrapper-strategy.type';
import { WrappersEnum } from './enum/wrappers.enum';
import { WrapperStrategy } from './strategy/wrapper.strategy';

export interface testtt extends WrapperBuilderInterface {
  setName(): this;
}
export class WrapperService {
  private dictionary: WrapperStrategyType;
  constructor(
    @Inject(ZAMMAD_WRAPPER_SERVICE)
    private readonly zammadWrapperBuilderService: WrapperBuilderInterface,
    private readonly wrapperStrategy: WrapperStrategy,
  ) {
    this.dictionary = {
      zammad: this.zammadWrapperBuilderService,
    };
  }

  getBuilder(type: WrappersEnum): WrapperBuilderInterface {
    this.wrapperStrategy.setStrategy(this.dictionary[type]);
    return this.wrapperStrategy;
  }
}
