import { Injectable } from "@nestjs/common"
import { LoginService } from "./login.service"
import { OauthService } from "./oauth.service"

@Injectable()
export class AuthService {

  constructor (
    public readonly oath: OauthService,
    public readonly login: LoginService
  ){}
  

}
