import { UserProfileResultDtoFormat } from '../user-profile.result.dto';
import { AccessTokenDto } from '../../../security/auth/dto/access-token.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateUserProfileResultDto {
  @ApiResponseProperty({
    type: UserProfileResultDtoFormat,
  })
  user: UserProfileResultDtoFormat;

  @ApiResponseProperty({
    type: AccessTokenDto,
  })
  tokens?: AccessTokenDto;
}
