import {Expose} from "class-transformer";

export class UserProfileDto {

    @Expose()
    id?: number | null

    @Expose()
    personality?: boolean | null

    @Expose()
    name?: string | null

    @Expose()
    family?: string | null

    @Expose()
    email?: string | null

    @Expose()
    phoneNumber?: string | null;

    @Expose()
    personalCode?: string | null;

    @Expose()
    birthDate?: null | Date;

    @Expose()
    companyOwner?: boolean | null

    @Expose()
    personalVerification?: boolean | null

    // @Expose()
    // companyId?: number
    //
    // @Expose()
    // companyName?: string
    //
    //
    // @Expose()
    // companyCode?: string
    //
    //
    // @Expose()
    // submittedCode?: string
    //
    //
    // @Expose()
    // economyCode?: string
    company: CompanyUserDto
}

export class CompanyUserDto {
    @Expose()
    companyName?: string| null


    @Expose()
    companyCode?: string| null


    @Expose()
    submittedCode?: string| null


    @Expose()
    economyCode?: string| null
}

// const  x :UserProfileDto={
//     email:"",
//     companyUser:{
//         companyCode:""
//
//     }
// }