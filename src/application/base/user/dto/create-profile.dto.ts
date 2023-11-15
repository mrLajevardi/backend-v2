import {
    IsBoolean,
    IsDate, IsDateString, IsDecimal, isDefined, IsNotEmpty,
    IsOptional,
    IsString, ValidateIf, ValidationOptions,
} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Groups} from 'src/infrastructure/database/entities/Groups';
import {Transform, Type} from "class-transformer";
import {json} from "express";

export class CreateProfileDto {

    constructor() {

    }
    @IsBoolean()
    @Transform(({value}) => JSON.parse(value))
    @ApiProperty({default: true})
    personality: boolean

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @IsString()
    @ApiProperty()
    family: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    phoneNumber?: string;

    @IsString()
    @ApiProperty()
    personalCode: string;

    @Transform(({value}) => new Date(value))
    @IsDate()
    @ApiProperty({type: Date})
    birthDate?: Date;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({default: false, required: false})
    companyOwner?: boolean

    @IsString()
    @ApiProperty()
    @ValidateIf((value) => !value.personality)
    companyName?: string

    @IsString()
    @ValidateIf((value) => !value.personality)
    @ApiProperty()
    companyCode?: string

    @IsString()
    @ValidateIf((value) => !value.personality)
    @ApiProperty({required: false})
    submittedCode?: string

    @IsString()
    @ValidateIf((value) => !value.personality)
    @ApiProperty()
    economyCode?: string
}
