import { PureAbility } from '@casl/ability';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';

interface IPolicyHandler {
  handle(ability: PureAbility, options?: PolicyHandlerOptions): boolean;
}

export interface PolicyHandlerOptions {
  session: SessionRequest['user'];
  payload: any;
  params: any;
  query: any;
}

type PolicyHandlerCallback = (
  ability: PureAbility,
  options?: PolicyHandlerOptions,
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
