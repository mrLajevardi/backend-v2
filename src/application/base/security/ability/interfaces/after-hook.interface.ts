import { AclSubjectsEnum } from '../enum/acl-subjects.enum';

export interface AfterHookOptions {
  userId: number;
  subjects: [AclSubjectsEnum];
}
