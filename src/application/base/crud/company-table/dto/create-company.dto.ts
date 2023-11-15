import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";


export class CreateCompanyDto {

    @IsString()
    @ApiProperty()
    @Expose()
    companyName: string;

    @IsString()
    @ApiProperty()
    @Expose()
    companyCode: string ;

    @IsString()
    @ApiProperty()
    @Expose()
    submittedCode: string;

    @IsString()
    @ApiProperty()
    @Expose()
    economyCode: string;
}