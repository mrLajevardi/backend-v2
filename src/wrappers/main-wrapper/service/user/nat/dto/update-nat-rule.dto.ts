import { CreateNatRuleConfig } from './create-nat-rule.dto';

export class UpdateNatRuleConfig extends CreateNatRuleConfig {
  ruleId: string;
}
