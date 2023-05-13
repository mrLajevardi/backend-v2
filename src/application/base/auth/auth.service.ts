import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
    ) {}

    // Validate user performs using Local.strategy
    async validateUser(username: string, pass: string): Promise<any> {
      console.log("validate user");
      const user = await this.usersService.findOne({
        username: username
      });

      // checking the availablity of the user and
      const isValid = await this.usersService.comparePassword(user.password,pass);
      if (user && isValid) {
        const { password, ...result } = user;
        console.log(result);
        return result;
      }
      return null;
    }
    
    // This function will be called in AuthController.login after 
    // the success of local strategy
    // it will return the JWT token 
    async login(dto: LoginDto) {
      console.log("auth service login", dto)
      return {
        access_token: this.jwtService.sign({
          username: dto.username,
          password: dto.password
        }),
      };
    }
    
}
