import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface AnswerDto extends EndpointOptionsInterface {
  urlParams: AnswerUrlParams;
  body: AnswerBody;
}

interface AnswerUrlParams {
  vmId: string;
}

export class AnswerBody {
  questionId: string;
  choiceId: string;
}
