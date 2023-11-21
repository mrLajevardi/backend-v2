import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";


export class CreateProvinceDto {
    @IsString()
    @ApiProperty()
    @Expose()
    ProvinceName: string;

    @IsString()
    @ApiProperty()
    @Expose()
    PhoneCode: string;
}