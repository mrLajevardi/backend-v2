import {Injectable} from "@nestjs/common";
import {UserPayload} from "../../dto/user-payload.dto";

// @Injectable()
export interface TwoFaAuthInterface {

    sendOtp(user: UserPayload): Promise<any>;

    verifyOtp(user: UserPayload, otp: string , hash: string): Promise<any>;
}