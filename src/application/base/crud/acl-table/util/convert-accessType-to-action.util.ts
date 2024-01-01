import { Action } from 'src/application/base/security/ability/enum/action.enum';
import { AccessType } from '../enum/access-type.enum';

export function convertAccessTypeToAction(accessType: AccessType): Action {
  return Action[AccessType[accessType] as keyof typeof Action];
}

export function convertActionToAccessType(action: Action): AccessType {
  return AccessType[Action[action] as keyof typeof AccessType];
}
