import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    vdcPassword: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    family: string;

    @ApiProperty()
    phoneNumber: string;

    active: boolean;
    phoneVerified: boolean;

    @ApiProperty()
    acceptTermsOfService: boolean;
}