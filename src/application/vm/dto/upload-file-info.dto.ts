import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ImageTypeEnum } from '../enums/image-type.enum';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';

export class UploadFileDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: ImageTypeEnum, enum: ImageTypeEnum })
  @IsEnum(ImageTypeEnum)
  imageType: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  size: number;
}

export class UploadFileReturnDto extends TaskReturnDto {
  @ApiProperty({ type: String })
  transferId: string;
}
