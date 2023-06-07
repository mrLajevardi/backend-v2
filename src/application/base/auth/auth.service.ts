import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // Validate user performs using Local.strategy
  async validateUser(username: string, pass: string): Promise<any> {
    console.log('validate user');
    if (!username) {
      throw new UnauthorizedException('No username provided');
    }

    if (!pass) {
      throw new UnauthorizedException('No password provided');
    }

    const user = await this.usersService.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    // checking the availablity of the user and
    const isValid = await this.usersService.comparePassword(
      user.password,
      pass,
    );
    if (user && isValid) {
      // eslint-disable-next-line
      const { password, ...result } = user;

      //console.log(result);
      return result;
    }
    return null;
  }

  // This function will be called in AuthController.login after
  // the success of local strategy
  // it will return the JWT token
  async login(user: any) {
    // console.log("auth service login", dto)
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
