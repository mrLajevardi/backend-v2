import { ApiProperty } from "@nestjs/swagger";

export class OtpLoginDto {
    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    otp?: string;

    @ApiProperty()
    hash?: string ;
}