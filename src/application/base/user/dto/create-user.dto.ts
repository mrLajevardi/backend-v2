import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto { 
    @ApiProperty()
    realm : string; 

    @ApiProperty()
    username : string;

    @ApiProperty()
    password : string;
    
    @ApiProperty()
    email? : string; 
    
    @ApiProperty()
    emailVerified? : boolean;
    
    @ApiProperty()
    name : string; 

    @ApiProperty()
    family : string;     

    @ApiProperty()
    verificationToken: boolean;
    
    @ApiProperty()
    deleted? : boolean;
    
    @ApiProperty()
    createDate : Date;

    @ApiProperty()
    updateDate? : Date; 

    @ApiProperty()
    code? : string; 

    @ApiProperty()
    emailToken? : string; 

    @ApiProperty()
    credit? : number;

    @ApiProperty()
    vdcPassword? : string; 

    @ApiProperty()
    hasVdc? : boolean;

    @ApiProperty()
    phoneNumber? : string; 

    @ApiProperty()
    orgName? : string;

    @ApiProperty()
    acceptTermsOfService? : boolean;

    @ApiProperty()
    phoneVerified : boolean;


    
}