import {
  UserProfileResultDto,
  UserProfileResultDtoFormat,
} from '../../../user/dto/user-profile.result.dto';
import { EntityLog } from '../../../../../infrastructure/database/entities/EntityLog';
import { Company } from '../../../../../infrastructure/database/entities/Company';

export class EntityLogResultDto {
  collection(data: EntityLog[]): EntityLogResultDtoFormat[] {
    return data.map((item: EntityLog) => {
      return this.toArray(item);
    });
  }

  toArray(item: EntityLog): EntityLogResultDtoFormat {
    return {
      id: item.id,
      date: item.createDate,
      fields: JSON.parse(item.fields),
      user: new UserProfileResultDto().toArray(item.user),
      before: JSON.parse(item.before),
      after: JSON.parse(item.after),
    };
  }
}

export class EntityLogResultDtoFormat {
  id: number;
  fields: string[];
  user?: UserProfileResultDtoFormat;
  date: Date;
  before: string[];
  after: string[];
}
