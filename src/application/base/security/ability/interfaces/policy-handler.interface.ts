import { PureAbility } from '@casl/ability';

interface IPolicyHandler {
  handle(ability: PureAbility): boolean;
}

type PolicyHandlerCallback = (ability: PureAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
