import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
export class CreateVmFromTemplate {
    @ApiProperty({ type: String})
    @IsString()
    name: string;

    @ApiProperty({ type: String})
    @IsString()
    description: string;
}